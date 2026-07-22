import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ value = 0, prefix = '₹', suffix = '', duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;
    const startValue = displayValue;
    const endValue = typeof value === 'number' ? value : Number(value) || 0;
    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic for ultra-smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(current);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

export default AnimatedNumber;
