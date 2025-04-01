import { Button } from "react-bootstrap";
import { toast } from "sonner";

const SaveButton = ({ onSave, isValid, data, onStopTimer }) => {
  const handleSave = () => {
    if (isValid) {
      if (!data || data.trim() === "") {
        toast.warning("El campo no puede estar vacío."); // Muestra un mensaje de error
      } else {
        const stoppedTime = onStopTimer(); // Detiene el temporizador y obtiene el tiempo detenido
        if (stoppedTime) {
          console.log("Tiempo detenido desde SaveButton:", stoppedTime); // Imprime el tiempo detenido
          onSave(data); // Envía los datos al componente padre
          toast.success("Guardado correctamente.");
        } else {
          toast.error(
            "No se pudo detener el temporizador. Verifica la configuración."
          );
        }
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
      Guardar
    </Button>
  );
};

export default SaveButton;
