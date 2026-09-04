import React from "react";

export default function PendulumLoader() {
  return (
    <>
      {/* الطبقة الخلفية (overlay) */}
      <div className="loader-overlay" />
      
      {/* اللودر في النص فوق الطبقة */}
      <div className="loader-container">
        <span className="loader-pendulum" />
      </div>
    </>
  );
}