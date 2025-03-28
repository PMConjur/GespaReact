import { useState, useEffect, useRef } from "react";

const Timmer = ({ start, stop }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const timerIntervalRef = useRef(null); // Usar useRef para almacenar el intervalo

  useEffect(() => {
    if (start && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const { hours, minutes, seconds } = prevTime;
          if (seconds < 59) {
            return { ...prevTime, seconds: seconds + 1 };
          } else if (minutes < 59) {
            return { hours, minutes: minutes + 1, seconds: 0 };
          } else {
            return { hours: hours + 1, minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    }

    if (stop && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null; // Asegura que el intervalo se limpie correctamente
      }
    };
  }, [start, stop]); // Mantener solo `start` y `stop` como dependencias

  const formatTime = (value) => (value < 10 ? `0${value}` : value);

  return (
    <div>
      <h5 className="text-success">
        {formatTime(time.hours)}:{formatTime(time.minutes)}:
        {formatTime(time.seconds)}
      </h5>
    </div>
  );
};

export default Timmer;
