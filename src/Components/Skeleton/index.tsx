import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div id="loading-skeleton" data-testid="loading-skeleton" className="h-screen mt-10 animate-pulse">
      <div className="w-full bg-gray-300 mt-3 h-20 rounded-lg" />
      <div className="w-full bg-gray-300 mt-3 h-20 rounded-lg" />
      <div className="w-full bg-gray-300 mt-3 h-20 rounded-lg" />
      <div className="w-full bg-gray-300 mt-3 h-20 rounded-lg" />
    </div>
  );
};

export default Skeleton;
