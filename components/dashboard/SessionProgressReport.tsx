'use client';

interface ProgressReportProps {
  beforeGym: {
    weight: string;
    heartRate: string;
    energy: string;
    mood: string;
    notes: string;
  };
  afterGym?: {
    weight: string;
    heartRate: string;
    duration: string;
    caloriesBurned: string;
    exercises: string;
    notes: string;
  };
  date: string;
}

export default function SessionProgressReport({ beforeGym, afterGym, date }: ProgressReportProps) {
  const weightBefore = parseFloat(beforeGym.weight);
  const weightAfter = afterGym ? parseFloat(afterGym.weight) : null;
  const weightDiff = weightAfter ? (weightBefore - weightAfter).toFixed(1) : null;

  const hrBefore = parseInt(beforeGym.heartRate);
  const hrAfter = afterGym ? parseInt(afterGym.heartRate) : null;
  const hrChange = hrAfter ? hrAfter - hrBefore : null;

  const energyBefore = parseInt(beforeGym.energy);

  const recommendations: string[] = [];

  // Generate personalized recommendations
  if (afterGym) {
    const caloriesBurned = parseInt(afterGym.caloriesBurned);
    const duration = parseInt(afterGym.duration);
    const avgCalPerMin = (caloriesBurned / duration).toFixed(1);

    if (weightDiff && parseFloat(weightDiff) > 1.5) {
      recommendations.push('💧 High fluid loss - Ensure proper hydration');
    }
    if (hrChange && hrChange > 50) {
      recommendations.push('❤️ Good cardiovascular workout - Monitor heart rate during cooldown');
    }
    if (caloriesBurned > 500) {
      recommendations.push('🔥 Intense session - Consider post-workout nutrition');
    }
    if (duration > 90) {
      recommendations.push('⏱️ Extended session - Ensure proper recovery');
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">SESSION PROGRESS REPORT</h2>
        <p className="text-gray-400 text-sm">Date: {date}</p>
      </div>

      {/* Pre-Gym Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <h3 className="text-red-500 font-bold mb-4 flex items-center space-x-2">
            <span>📊</span>
            <span>PRE-GYM METRICS</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Weight</span>
              <span className="font-bold text-lg">{beforeGym.weight} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Resting HR</span>
              <span className="font-bold text-lg">{beforeGym.heartRate} BPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy Level</span>
              <span className="font-bold text-lg">{beforeGym.energy}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Mood</span>
              <span className="font-bold">{beforeGym.mood}</span>
            </div>
          </div>
        </div>

        {/* Post-Gym Stats */}
        {afterGym && (
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
            <h3 className="text-green-500 font-bold mb-4 flex items-center space-x-2">
              <span>💪</span>
              <span>POST-GYM METRICS</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Weight</span>
                <span className={`font-bold text-lg ${parseFloat(weightDiff!) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {afterGym.weight} kg <span className="text-xs">({weightDiff}kg)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Post-Workout HR</span>
                <span className="font-bold text-lg">{afterGym.heartRate} BPM <span className="text-xs text-gray-500">(+{hrChange})</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="font-bold text-lg">{afterGym.duration} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Calories Burned</span>
                <span className="font-bold text-lg text-orange-400">{afterGym.caloriesBurned} kcal</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workout Summary */}
      {afterGym && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
          <h3 className="text-blue-400 font-bold mb-3 flex items-center space-x-2">
            <span>🏋️</span>
            <span>WORKOUT SUMMARY</span>
          </h3>
          <div className="text-sm text-gray-300">
            <p className="whitespace-pre-wrap">{afterGym.exercises}</p>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {afterGym && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
            <h4 className="text-purple-400 font-bold mb-2">⚡ Intensity</h4>
            <div className="text-sm text-gray-300">
              <p className="mb-2">Avg Calories/Min: <span className="font-bold text-purple-400">{(parseInt(afterGym.caloriesBurned) / parseInt(afterGym.duration)).toFixed(1)} kcal/min</span></p>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                  style={{ width: `${Math.min((parseInt(afterGym.caloriesBurned) / parseInt(afterGym.duration) / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-lg">
            <h4 className="text-indigo-400 font-bold mb-2">❤️ Cardiovascular Load</h4>
            <div className="text-sm text-gray-300">
              <p className="mb-2">HR Increase: <span className="font-bold text-indigo-400">{hrChange} BPM</span></p>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                  style={{ width: `${Math.min((hrChange! / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
          <h3 className="text-yellow-500 font-bold mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>RECOMMENDATIONS</span>
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="text-sm text-gray-300">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {beforeGym.notes && (
          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
            <h4 className="text-red-400 font-bold mb-2">Pre-Gym Notes</h4>
            <p className="text-sm text-gray-300">{beforeGym.notes}</p>
          </div>
        )}
        {afterGym?.notes && (
          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
            <h4 className="text-green-400 font-bold mb-2">Post-Gym Notes</h4>
            <p className="text-sm text-gray-300">{afterGym.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
