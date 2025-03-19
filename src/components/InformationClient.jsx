import { Card, Table, Placeholder } from "react-bootstrap";
import { fetchInformation } from "../services/gespawebServices"; // Importa el servicio
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto DEL PADRE
import { toast, Toaster } from "sonner";
import "../scss/styles.scss";
import { InfoCircleFill } from "react-bootstrap-icons";

const InformationClient = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchResults } = useContext(AppContext);
  const [toastShown, setToastShown] = useState(false);

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const information = await Promise.all(
          searchResults.map(async (result, index) => {
            const information = await fetchInformation(result.idCuenta); // Usar result.idCuenta
            if (information.length === 0 && !toastShown) {
              toast.error(
                `No hay carga de información para la cuenta ${result.idCuenta}`,
                {
                  position: "top-right" // Mostrar toast en el lado derecho
                }
              );
              setToastShown(true); // Marcar que el toast ya se mostró
            }
            return information;
          })
        );
        const flatInformation = information.flat();
        setData(flatInformation); // Actualizar el estado con los datos de la API
      } catch (error) {
        console.error("Error al cargar la información:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Tiempo de carga simulado
      }
    };

    loadData();
  }, [searchResults, toastShown]);

  const renderRow = (item) => {
    // Filtrar las entradas para omitir "Dif_diasTotales"
    const entries = Object.entries(item).filter(([key]) => key !== "Dif_diasTotales");
    const rows = [];
  
    for (let i = 0; i < entries.length; i += 3) { // Dividir en filas de 3 columnas
      rows.push(
        <tr key={i} className="gap-3">
          {entries.slice(i, i + 3).map(([key, value], index) => (
            <td key={index} className="text-success">
              {key}: {value || "--"}
            </td>
          ))}
        </tr>
      );
    }
  
    return rows;
  };
  return (
    <Card className="overflow-auto">
      <Card.Header className="text-white">
        <i className="h5 card-title">
          <InfoCircleFill></InfoCircleFill> Información
        </i>
      </Card.Header>
      <Card.Body>
        <div className="table-container">
          <Table
            hover
            className="table table-borderless table-custom2"
            variant="dark"
          >
            <tbody>
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(2)].map((_, j) => (
                        <td key={j}>
                          <Placeholder as="span" animation="glow">
                            <Placeholder xs={12} />
                          </Placeholder>
                        </td>
                      ))}
                    </tr>
                  ))
                : data.length === 0
                ? renderRow({})
                : data.map((item, index) => (
                    <React.Fragment key={index}>
                      {renderRow(item)}
                    </React.Fragment>
                  ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InformationClient;