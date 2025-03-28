import { Button } from "react-bootstrap";
import { toast } from "sonner"; // Importa toast para mostrar mensajes
import { useState } from "react";

const SaveButton = ({ onSave, isValid, data, onStopTimer }) => {
  const [stoppedTime, setStoppedTime] = useState(null); // Estado para almacenar el tiempo detenido

  const handleSave = () => {
    if (isValid) {
      if (!data || data.trim() === "") {
        toast.warning("El campo no puede estar vacío."); // Muestra un mensaje de error
      } else {
        const time = onStopTimer(); // Detiene el temporizador y obtiene el tiempo
        setStoppedTime(time); // Almacena el tiempo detenido
        onSave(data); // Envía los datos al componente padre
        toast.success("Guardado correctamente.");
      }
    } else {
      toast.warning("El contenido no es válido."); // Muestra un mensaje de error
    }
  };

  return (
    <Button
      variant="primary"
      className="mt-3"
      disabled={!isValid}
      onClick={handleSave}
    >
      {stoppedTime
        ? `Guardado en ${stoppedTime.hours}:${stoppedTime.minutes}:${stoppedTime.seconds}`
        : "Guardar"}
    </Button>
  );
};

export default SaveButton;
