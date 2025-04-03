import TimmerAccount from "./flowComponents/TimmerAccount";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../pages/Managment"; // Import AppContext

const StickyTimmer = () => {
  const { searchResults, setStoppedTimeSticky } = useContext(AppContext); // Agrega funciones del contexto para manejar estados
  const [startTimer, setStartTimer] = useState(false);

  // Usar el primer resultado o los datos predeterminados
  const defaultData = {
    nombreDeudor: "-"
  };
  const result = searchResults[0] || defaultData;

  useEffect(() => {
    if (searchResults.length > 0) {
      setStartTimer(true); // Inicia el cronómetro cuando searchResults cambia
    }
  }, [searchResults]);

  const handleCaptureTime = (time) => {
    setStoppedTimeSticky(time); // Actualiza el tiempo actual en el contexto
    console.log("Tiempo capturado en StickyTimmer:", time); // Imprime el tiempo capturado
  };

  return (
    <div className="sticky-timmer-container">
      <button className="sticky-timmer-btn">
        <h6>{result.nombreDeudor}</h6>
        <TimmerAccount
          start={startTimer}
          onCaptureTime={handleCaptureTime} // Captura el tiempo actual
          className="timmer"
        />
      </button>
    </div>
  );
};

export default StickyTimmer;
