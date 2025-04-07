
import React from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Processing your results..." }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingScreen;
