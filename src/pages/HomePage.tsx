import Home from '@/components/Home';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className='min-w-full sm:px-[5rem]'>
      <div className='w-full mb-2'>
        <Home/>
      </div>
    </div>
  );
};

export default HomePage;
