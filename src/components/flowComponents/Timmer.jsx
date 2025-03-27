import { useState, useEffect } from "react";

const Timmer = ({ start, stop }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    if (start && !timerInterval) {
      const interval = setInterval(() => {
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
      setTimerInterval(interval);
    }

    if (stop && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [start, stop, timerInterval]);

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
