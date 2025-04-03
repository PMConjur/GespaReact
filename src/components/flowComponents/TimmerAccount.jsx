import { useState, useEffect, useRef } from "react";

const TimmerAccount = ({ start, onCaptureTime }) => {
  const [time, setTime] = useState(0); // Tiempo en segundos
  const timerIntervalRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (start && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [start]);

  useEffect(() => {
    if (onCaptureTime) {
      onCaptureTime(formatTime(time)); // Envía el tiempo actual al padre
    }
  }, [onCaptureTime, time]);

  return (
    <div>
      <h5 className="text-success">{formatTime(time)}</h5>
    </div>
  );
};

export default TimmerAccount;
