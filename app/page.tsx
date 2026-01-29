// app/page.tsx
import Landing from '@/components/landing';   // ← this is the key line

// If your file is named Landing.tsx (capital L), use:
// import Landing from '@/components/Landing';

export default function Home() {
  return <Landing />;
}