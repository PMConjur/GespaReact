import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../../pages/Managment";

const Timmer = ({ start, stop }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const timerIntervalRef = useRef(null);
  const { setStoppedTime } = useContext(AppContext);

  const formatTime = (value) => (value < 10 ? `0${value}` : value);

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

      const formattedTime = `${formatTime(time.hours)}:${formatTime(
        time.minutes
      )}:${formatTime(time.seconds)}`;
      setStoppedTime(formattedTime); // Envía el tiempo detenido al contexto
      console.log("Tiempo detenido enviado al contexto:", formattedTime);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [start, stop, time, setStoppedTime]);

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
