'use client';

import { useEffect, useState } from 'react';

export default function WelcomeAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {isVisible && (
        <>
          <div className="absolute top-1/4 left-1/4 text-4xl text-secondary/30 animate-float-1">♥</div>
          <div className="absolute top-1/3 right-1/4 text-3xl text-secondary/25 animate-float-2">♥</div>
          <div className="absolute bottom-1/3 left-1/3 text-5xl text-secondary/20 animate-float-3">♥</div>
          <div className="absolute top-1/2 right-1/3 text-2xl text-secondary/15 animate-float-4">♥</div>
          <div className="absolute bottom-1/4 right-1/5 text-6xl text-secondary/35 animate-float-5">♥</div>
          <div className="absolute top-1/5 right-1/2 text-3xl text-primary/10 animate-float-6">♥</div>
          <div className="absolute bottom-1/2 left-1/5 text-4xl text-secondary/20 animate-float-7">♥</div>
          <div className="absolute top-3/4 left-1/5 text-3xl text-secondary/20 animate-float-8">♥</div>
          <div className="absolute top-1/6 right-1/6 text-5xl text-secondary/15 animate-float-9">♥</div>
          <div className="absolute bottom-1/5 left-1/2 text-4xl text-primary/10 animate-float-10">♥</div>
          <div className="absolute top-1/3 left-3/4 text-2xl text-secondary/20 animate-float-11">♥</div>
          <div className="absolute bottom-3/4 right-1/3 text-6xl text-secondary/25 animate-float-12">♥</div>
        </>
      )}

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-80px) scale(1.2) rotate(10deg); opacity: 0.8; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-60px) scale(1.1) rotate(-5deg); opacity: 0.7; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-100px) scale(1.3) rotate(8deg); opacity: 0.6; }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-50px) scale(1.1) rotate(-8deg); opacity: 0.5; }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.25; }
          50% { transform: translateY(-90px) scale(1.2) rotate(12deg); opacity: 0.8; }
        }
        @keyframes float-6 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-70px) scale(1.15) rotate(-6deg); opacity: 0.5; }
        }
        @keyframes float-7 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-75px) scale(1.1) rotate(5deg); opacity: 0.6; }
        }
        @keyframes float-8 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-85px) scale(1.15) rotate(-10deg); opacity: 0.6; }
        }
        @keyframes float-9 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-55px) scale(1.1) rotate(6deg); opacity: 0.4; }
        }
        @keyframes float-10 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.12; }
          50% { transform: translateY(-95px) scale(1.2) rotate(-7deg); opacity: 0.5; }
        }
        @keyframes float-11 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-65px) scale(1.1) rotate(9deg); opacity: 0.7; }
        }
        @keyframes float-12 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-105px) scale(1.25) rotate(-11deg); opacity: 0.7; }
        }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 9s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 5s ease-in-out infinite; }
        .animate-float-6 { animation: float-6 7.5s ease-in-out infinite; }
        .animate-float-7 { animation: float-7 6.5s ease-in-out infinite; }
        .animate-float-8 { animation: float-8 8.5s ease-in-out infinite; }
        .animate-float-9 { animation: float-9 7.2s ease-in-out infinite; }
        .animate-float-10 { animation: float-10 6.8s ease-in-out infinite; }
        .animate-float-11 { animation: float-11 9.2s ease-in-out infinite; }
        .animate-float-12 { animation: float-12 5.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}