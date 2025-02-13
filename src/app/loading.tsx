"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingComponent = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="text-white mb-4 flex items-center">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Cargando...</span>
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const Loading = () => {
  return <LoadingComponent />;
};

export default Loading;
