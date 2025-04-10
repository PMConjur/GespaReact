import { Button } from "react-bootstrap";
import { toast } from "sonner";
import { useContext } from "react";
import { AppContext } from "../../pages/Managment";

const SaveButton = ({ onSave, isValid, data, onStopTimer, idContacto }) => {
  const { setTriggerUpdateStickyTime } = useContext(AppContext); // Obtiene la función para accionar la actualización del tiempo

  const handleSave = () => {
    if (idContacto === 1109 || idContacto === 1129) {
      setTriggerUpdateStickyTime((prev) => !prev); // Activa el trigger para actualizar el tiempo en StickyTimmer
      onStopTimer(); // Llama a la función para detener el cronómetro
      onSave(data); // Envía los datos al componente padre
    } else if (isValid) {
      if (!data || data.trim() === "") {
        toast.warning("El campo no puede estar vacío."); // Muestra un mensaje de error
      } else {
        setTriggerUpdateStickyTime((prev) => !prev); // Activa el trigger para actualizar el tiempo en StickyTimmer
        onStopTimer(); // Llama a la función para detener el cronómetro
        onSave(data); // Envía los datos al componente padre
      }
    } else {
      toast.warning("El contenido no es válido."); // Muestra un mensaje de error
    }
  };

  return (
    <Button
      variant="primary"
      className="mt-3"
      disabled={!isValid && !(idContacto === 1109 || idContacto === 1129)}
      onClick={handleSave}
    >
      Guardar
    </Button>
  );
};

export default SaveButton;
