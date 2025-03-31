import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../../pages/Managment";

const Timmer = ({ start, stop }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const timerIntervalRef = useRef(null); // Usar useRef para almacenar el intervalo
  const { setStoppedTime } = useContext(AppContext); // Contexto para actualizar el tiempo detenido
  const currentTimeRef = useRef({ hours: 0, minutes: 0, seconds: 0 }); // Variable para almacenar el tiempo actual

  useEffect(() => {
    if (start && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const { hours, minutes, seconds } = prevTime;
          let newTime;
          if (seconds < 59) {
            newTime = { ...prevTime, seconds: seconds + 1 };
          } else if (minutes < 59) {
            newTime = { hours, minutes: minutes + 1, seconds: 0 };
          } else {
            newTime = { hours: hours + 1, minutes: 0, seconds: 0 };
          }
          currentTimeRef.current = newTime; // Actualiza la referencia del tiempo actual
          return newTime;
        });
      }, 1000);
    }

    if (stop && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      setStoppedTime(currentTimeRef.current); // Enviar el tiempo detenido al contexto
      console.log("Tiempo detenido:", currentTimeRef.current); // Imprimir el tiempo detenido
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null; // Asegura que el intervalo se limpie correctamente
      }
    };
  }, [start, stop, setStoppedTime]); // Mantener solo `start`, `stop` y `setStoppedTime` como dependencias

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
