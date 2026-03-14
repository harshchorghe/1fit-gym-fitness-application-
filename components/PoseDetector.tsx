'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

export type CameraExercise = string;

type DetectionMode =
  | 'squat'
  | 'lunge'
  | 'pushup'
  | 'jumping-jack'
  | 'plank'
  | 'core'
  | 'upper-body'
  | 'auto';

type PoseDetectorProps = {
  exercise: CameraExercise;
  targetReps?: number;
};

type SimpleLandmark = {
  x: number;
  y: number;
  visibility?: number;
};

function inferDetectionMode(exerciseName: string): DetectionMode {
  const normalized = exerciseName.toLowerCase();

  if (/(plank|side plank|hollow hold|wall sit|isometric)/.test(normalized)) {
    return 'plank';
  }

  if (/(jumping jack|star jump|skipping|hop)/.test(normalized)) {
    return 'jumping-jack';
  }

  // Prioritize lower-body tags before upper-body to avoid false matches from tips like
  // "press through heels" in squat/lunge instructions.
  if (/(lunge|split squat|step-up|step up)/.test(normalized)) {
    return 'lunge';
  }

  if (/(squat|deadlift|hip thrust|glute bridge|calf raise|leg press|goblet squat)/.test(normalized)) {
    return 'squat';
  }

  if (/(push\s?up|push-up|dip|burpee|mountain climber|tricep|bench press|shoulder press|overhead press|pull-up|row|curl)/.test(normalized)) {
    return 'upper-body';
  }

  if (/(crunch|sit-up|sit up|russian twist|v-up|leg raise)/.test(normalized)) {
    return 'core';
  }

  return 'auto';
}

export default function PoseDetector({ exercise, targetReps }: PoseDetectorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);

  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState('Position yourself in frame');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holdSeconds, setHoldSeconds] = useState(0);

  const phaseRef = useRef<'up' | 'down'>('up');
  const jackPhaseRef = useRef<'open' | 'closed'>('closed');
  const plankStartedAtRef = useRef<number | null>(null);
  const lastRepAtRef = useRef(0);
  const validCycleRef = useRef(false);
  const cycleStartedAtRef = useRef<number | null>(null);
  const downFrameStreakRef = useRef(0);
  const upFrameStreakRef = useRef(0);

  const detectionMode = useMemo(() => inferDetectionMode(exercise), [exercise]);

  useEffect(() => {
    setRepCount(0);
    setHoldSeconds(0);
    setFeedback('Position yourself in frame');
    phaseRef.current = 'up';
    jackPhaseRef.current = 'closed';
    plankStartedAtRef.current = null;
    lastRepAtRef.current = 0;
    validCycleRef.current = false;
    cycleStartedAtRef.current = null;
    downFrameStreakRef.current = 0;
    upFrameStreakRef.current = 0;
  }, [exercise]);

  useEffect(() => {
    let cancelled = false;

    const updateFeedback = (next: string) => {
      setFeedback((prev) => (prev === next ? prev : next));
    };

    const bumpRep = () => {
      const now = performance.now();
      if (now - lastRepAtRef.current < 350) {
        return;
      }

      lastRepAtRef.current = now;
      setRepCount((prev) => prev + 1);
    };

    const hasGoodVisibility = (...points: Array<SimpleLandmark | null>) =>
      points.every((point) => point && (point.visibility ?? 0) > 0.6);

    const noteDownProgress = (formOk: boolean) => {
      if (formOk) {
        downFrameStreakRef.current += 1;
      } else {
        downFrameStreakRef.current = 0;
        validCycleRef.current = false;
      }

      if (downFrameStreakRef.current >= 2 && !validCycleRef.current) {
        validCycleRef.current = true;
        cycleStartedAtRef.current = performance.now();
      }
    };

    const noteUpProgressAndCount = (formOk: boolean) => {
      if (formOk && validCycleRef.current) {
        upFrameStreakRef.current += 1;
      } else {
        upFrameStreakRef.current = 0;
      }

      if (upFrameStreakRef.current < 1) {
        return;
      }

      const now = performance.now();
      const cycleMs = cycleStartedAtRef.current ? now - cycleStartedAtRef.current : 0;
      const durationLooksValid = cycleMs >= 300 && cycleMs <= 8000;

      if (durationLooksValid) {
        bumpRep();
      }

      validCycleRef.current = false;
      cycleStartedAtRef.current = null;
      downFrameStreakRef.current = 0;
      upFrameStreakRef.current = 0;
    };

    const getAngle = (a: SimpleLandmark, b: SimpleLandmark, c: SimpleLandmark): number => {
      const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
      let angle = Math.abs((radians * 180) / Math.PI);
      if (angle > 180) {
        angle = 360 - angle;
      }
      return angle;
    };

    const toLandmark = (point: unknown): SimpleLandmark | null => {
      if (!point || typeof point !== 'object') {
        return null;
      }

      const candidate = point as Partial<SimpleLandmark>;
      if (typeof candidate.x !== 'number' || typeof candidate.y !== 'number') {
        return null;
      }

      return {
        x: candidate.x,
        y: candidate.y,
        visibility: typeof candidate.visibility === 'number' ? candidate.visibility : undefined,
      };
    };

    const pickSide = (
      leftA: SimpleLandmark | null,
      leftB: SimpleLandmark | null,
      leftC: SimpleLandmark | null,
      rightA: SimpleLandmark | null,
      rightB: SimpleLandmark | null,
      rightC: SimpleLandmark | null
    ): [SimpleLandmark, SimpleLandmark, SimpleLandmark] | null => {
      const leftVisible = Math.min(leftA?.visibility ?? 0, leftB?.visibility ?? 0, leftC?.visibility ?? 0);
      const rightVisible = Math.min(rightA?.visibility ?? 0, rightB?.visibility ?? 0, rightC?.visibility ?? 0);

      if (leftVisible < 0.5 && rightVisible < 0.5) {
        return null;
      }

      if (leftVisible >= rightVisible && leftA && leftB && leftC) {
        return [leftA, leftB, leftC];
      }

      if (rightA && rightB && rightC) {
        return [rightA, rightB, rightC];
      }

      return null;
    };

    const detectRep = (landmarks: unknown[]) => {
      const leftHip = toLandmark(landmarks[23]);
      const leftKnee = toLandmark(landmarks[25]);
      const leftAnkle = toLandmark(landmarks[27]);
      const rightHip = toLandmark(landmarks[24]);
      const rightKnee = toLandmark(landmarks[26]);
      const rightAnkle = toLandmark(landmarks[28]);

      const leftShoulder = toLandmark(landmarks[11]);
      const leftElbow = toLandmark(landmarks[13]);
      const leftWrist = toLandmark(landmarks[15]);
      const rightShoulder = toLandmark(landmarks[12]);
      const rightElbow = toLandmark(landmarks[14]);
      const rightWrist = toLandmark(landmarks[16]);

      const leftSideKnee = pickSide(leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle);
      const leftSideElbow = pickSide(
        leftShoulder,
        leftElbow,
        leftWrist,
        rightShoulder,
        rightElbow,
        rightWrist
      );

      if (detectionMode === 'plank') {
        const picked = pickSide(leftShoulder, leftHip, leftAnkle, rightShoulder, rightHip, rightAnkle);
        if (!picked) {
          plankStartedAtRef.current = null;
          setHoldSeconds(0);
          updateFeedback('Move fully into frame for plank posture tracking');
          return;
        }

        const [shoulder, hip, ankle] = picked;
        const torsoAngle = getAngle(shoulder, hip, ankle);

        if (torsoAngle > 145 && torsoAngle < 178) {
          if (!plankStartedAtRef.current) {
            plankStartedAtRef.current = Date.now();
          }

          const seconds = Math.floor((Date.now() - plankStartedAtRef.current) / 1000);
          setHoldSeconds(seconds);

          if (torsoAngle < 155) {
            updateFeedback('Lift hips slightly and keep a straight line');
          } else {
            updateFeedback('Solid plank alignment, keep breathing steady');
          }
        } else {
          plankStartedAtRef.current = null;
          setHoldSeconds(0);
          if (torsoAngle >= 178) {
            updateFeedback('Avoid arching your lower back');
          } else {
            updateFeedback('Raise your hips to straighten the torso');
          }
        }

        return;
      }

      if (detectionMode === 'jumping-jack') {
        if (!leftWrist || !rightWrist || !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
          updateFeedback('Show full body for jumping-jack tracking');
          return;
        }

        const wristDistance = Math.abs(leftWrist.x - rightWrist.x);
        const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
        const ankleDistance = Math.abs(leftAnkle.x - rightAnkle.x);
        const wristsAboveShoulders = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
        const anklesWideEnough = ankleDistance > shoulderDistance * 1.5;

        const isOpen = wristDistance > shoulderDistance * 2.2 && anklesWideEnough && wristsAboveShoulders;
        const isClosed = wristDistance < shoulderDistance * 1.3 && ankleDistance < shoulderDistance * 1.2;

        if (isOpen && jackPhaseRef.current !== 'open') {
          jackPhaseRef.current = 'open';
        }

        if (isClosed && jackPhaseRef.current === 'open') {
          jackPhaseRef.current = 'closed';
          noteUpProgressAndCount(true);
        }

        if (isOpen) {
          noteDownProgress(true);
          updateFeedback('Great extension, return under control');
        } else {
          updateFeedback('Open arms and legs wider each rep');
        }

        return;
      }

      const detectWithElbow = () => {
        if (!leftSideElbow) {
          return false;
        }

        const [shoulder, elbow, wrist] = leftSideElbow;
        const elbowAngle = getAngle(shoulder, elbow, wrist);
        const bodyLine = pickSide(leftShoulder, leftHip, leftAnkle, rightShoulder, rightHip, rightAnkle);
        const torsoAngle = bodyLine ? getAngle(bodyLine[0], bodyLine[1], bodyLine[2]) : null;
        const postureOk = torsoAngle !== null && torsoAngle > 145 && torsoAngle < 178;
        const visibilityOk = hasGoodVisibility(shoulder, elbow, wrist);
        const formOk = postureOk && visibilityOk;

        if (elbowAngle < 95 && phaseRef.current !== 'down') {
          phaseRef.current = 'down';
        }

        if (phaseRef.current === 'down') {
          noteDownProgress(formOk && elbowAngle < 95);
        }

        if (elbowAngle > 155 && phaseRef.current === 'down') {
          phaseRef.current = 'up';
          noteUpProgressAndCount(formOk && elbowAngle > 155);
        }

        if (!formOk) {
          updateFeedback('Keep body in a straight line for valid reps');
        } else if (elbowAngle > 165) {
          updateFeedback('Lower with control and keep elbows tracking');
        } else if (elbowAngle < 80) {
          updateFeedback('Good depth, drive back to full extension');
        } else {
          updateFeedback('Strong upper-body form, keep core tight');
        }

        return true;
      };

      const detectWithKnee = (mode: 'squat' | 'lunge' | 'auto') => {
        if (!leftSideKnee) {
          return false;
        }

        const [hip, knee, ankle] = leftSideKnee;
        const kneeAngle = getAngle(hip, knee, ankle);
        const torsoPicked = pickSide(leftShoulder, leftHip, leftKnee, rightShoulder, rightHip, rightKnee);
        const torsoToThighAngle = torsoPicked ? getAngle(torsoPicked[0], torsoPicked[1], torsoPicked[2]) : null;
        const visibilityOk = hasGoodVisibility(hip, knee, ankle);

        const squatFormOk = visibilityOk && torsoToThighAngle !== null && torsoToThighAngle > 55 && torsoToThighAngle < 170;
        const lungeFormOk = visibilityOk && torsoToThighAngle !== null && torsoToThighAngle > 70 && torsoToThighAngle < 170;
        const formOk = mode === 'lunge' ? lungeFormOk : squatFormOk;

        if (kneeAngle < 100 && phaseRef.current !== 'down') {
          phaseRef.current = 'down';
        }

        if (phaseRef.current === 'down') {
          noteDownProgress(formOk && kneeAngle < 100);
        }

        if (kneeAngle > 160 && phaseRef.current === 'down') {
          phaseRef.current = 'up';
          noteUpProgressAndCount(formOk && kneeAngle > 160);
        }

        if (mode === 'lunge') {
          if (!formOk) {
            updateFeedback('Keep torso upright and knee aligned over foot');
          } else if (kneeAngle > 160) {
            updateFeedback('Drop your back knee lower');
          } else if (kneeAngle < 90) {
            updateFeedback('Great lunge depth, drive through your front heel');
          } else {
            updateFeedback('Stay stable and keep torso upright');
          }
          return true;
        }

        if (!formOk) {
          updateFeedback('Brace core and keep knees tracking over toes');
        } else if (kneeAngle > 165) {
          updateFeedback('Go deeper for a complete lower-body rep');
        } else if (kneeAngle < 80) {
          updateFeedback('Great depth, stand back up with control');
        } else {
          updateFeedback('Good form, keep your chest up and knees aligned');
        }

        return true;
      };

      const detectCoreRep = () => {
        const picked = pickSide(leftShoulder, leftHip, leftKnee, rightShoulder, rightHip, rightKnee);
        if (!picked) {
          updateFeedback('Move fully into frame for core tracking');
          return false;
        }

        const [shoulder, hip, knee] = picked;
        const hipAngle = getAngle(shoulder, hip, knee);
        const visibilityOk = hasGoodVisibility(shoulder, hip, knee);
        const formOk = visibilityOk && hipAngle > 55 && hipAngle < 170;

        if (hipAngle < 95 && phaseRef.current !== 'down') {
          phaseRef.current = 'down';
        }

        if (phaseRef.current === 'down') {
          noteDownProgress(formOk && hipAngle < 95);
        }

        if (hipAngle > 145 && phaseRef.current === 'down') {
          phaseRef.current = 'up';
          noteUpProgressAndCount(formOk && hipAngle > 145);
        }

        if (!formOk) {
          updateFeedback('Stay controlled and keep your movement range clean');
        } else if (hipAngle < 90) {
          updateFeedback('Good crunch contraction, exhale at the top');
        } else {
          updateFeedback('Control the lowering phase, do not rush');
        }

        return true;
      };

      if (detectionMode === 'pushup' || detectionMode === 'upper-body') {
        if (!detectWithElbow()) {
          if (!detectWithKnee('auto')) {
            updateFeedback('Move fully into frame for upper-body tracking');
          }
        }
        return;
      }

      if (detectionMode === 'core') {
        if (!detectCoreRep()) {
          updateFeedback('Move fully into frame for core tracking');
        }
        return;
      }

      if (detectionMode === 'lunge') {
        if (!detectWithKnee('lunge')) {
          updateFeedback('Move fully into frame for lunge tracking');
        }
        return;
      }

      if (detectionMode === 'squat') {
        if (!detectWithKnee('squat')) {
          updateFeedback('Move fully into frame for lower-body tracking');
        }
        return;
      }

      if (!detectWithKnee('auto') && !detectWithElbow()) {
        updateFeedback('Show your full body to auto-detect movement pattern');
      }
    };

    const predictVideo = async () => {
      const landmarker = landmarkerRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (cancelled || !landmarker || !video || !canvas) {
        return;
      }

      if (video.readyState < 2) {
        rafRef.current = requestAnimationFrame(() => {
          void predictVideo();
        });
        return;
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      const result = landmarker.detectForVideo(video, performance.now());

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result.landmarks.length > 0) {
        const landmarks = result.landmarks[0];

        const drawingUtils = new DrawingUtils(ctx);
        drawingUtils.drawLandmarks(landmarks, { color: '#22c55e', lineWidth: 2, radius: 3 });
        drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
          color: '#22c55e',
          lineWidth: 3,
        });

        detectRep(landmarks as unknown[]);
      } else {
        updateFeedback('No body detected. Step back and center yourself.');
      }

      rafRef.current = requestAnimationFrame(() => {
        void predictVideo();
      });
    };

    const initialize = async () => {
      try {
        setError(null);
        setIsReady(false);

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        let landmarker: PoseLandmarker;
        try {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1,
          });
        } catch {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1,
          });
        }

        if (cancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 960 },
            height: { ideal: 540 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) {
          return;
        }

        video.srcObject = stream;
        await video.play();
        setIsReady(true);
        void predictVideo();
      } catch (initError) {
        const message =
          initError instanceof Error
            ? initError.message
            : 'Camera or model access failed';
        setError(message);
      }
    };

    void initialize();

    return () => {
      cancelled = true;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, [exercise]);

  const progressText = useMemo(() => {
    if (detectionMode === 'plank') {
      if (!targetReps || targetReps <= 0) {
        return `${holdSeconds}s hold`;
      }

      const remaining = Math.max(targetReps - holdSeconds, 0);
      if (remaining === 0) {
        return 'Hold target reached';
      }

      return `${remaining}s to target`;
    }

    if (!targetReps || targetReps <= 0) {
      return 'No target reps';
    }

    const remaining = Math.max(targetReps - repCount, 0);
    if (remaining === 0) {
      return 'Target reached';
    }

    return `${remaining} reps to target`;
  }, [detectionMode, holdSeconds, repCount, targetReps]);

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-black/70 p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-300">
          Live Coach: <span className="text-red-400 font-semibold uppercase">{exercise}</span>
        </p>
        <div className="flex items-center gap-4 text-sm">
          {detectionMode === 'plank' ? (
            <span className="text-white font-semibold">Hold: {holdSeconds}s</span>
          ) : (
            <span className="text-white font-semibold">Reps: {repCount}</span>
          )}
          <span className="text-gray-400">{progressText}</span>
        </div>
      </div>

      <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover scale-x-[-1]"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full scale-x-[-1] pointer-events-none"
        />

        {!isReady && !error && (
          <div className="absolute inset-0 grid place-items-center bg-black/50 text-sm text-gray-200">
            Preparing camera coach...
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-2">
        <p className="text-sm text-gray-200">{feedback}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-600/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          Camera coach unavailable: {error}
        </div>
      )}
    </div>
  );
}
