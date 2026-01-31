'use client';

import { useRouter } from 'next/navigation';

interface PlaceholderScreenProps {
  title: string;
}

export default function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 text-center">
        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {title.toUpperCase()}
        </h2>
        <p className="text-gray-400 mb-8">This section is under development</p>
        <button 
          onClick={() => router.push('/home/overview')}
          className="bg-red-500 hover:bg-red-600 px-8 py-3 font-bold transition-all"
        >
          BACK TO OVERVIEW
        </button>
      </div>
    </div>
  );
}