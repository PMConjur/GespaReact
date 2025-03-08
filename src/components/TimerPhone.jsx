import React, { useState, useEffect } from 'react';

const TimerPhone = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Actualizar la hora cada segundo
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Formatear la hora como HH:MM:SS
  const formattedTime = time.toLocaleTimeString();

  return (
    <div>
      <h1>Hora actual: {formattedTime}</h1>
    </div>
  );
};

export default TimerPhone;