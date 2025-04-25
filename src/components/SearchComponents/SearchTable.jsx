import { Table, Spinner } from "react-bootstrap";
import { fetchActionsSearch } from "../../services/gespawebServices";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../pages/Managment";
import { toast } from "sonner";
const SearchTable = () => {
  const { searchResults } = useContext(AppContext);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTableData = async () => {
      if (searchResults.length > 0) {
        const idCuenta = searchResults?.[0].idCuenta;
        setIsLoading(true);
        try {
          const response = await fetchActionsSearch(idCuenta);
          const processedData = mapResponseToTableData(response);
          setTableData(processedData);
        } catch (error) {
          console.error("Error al cargar los datos de la tabla:", error);
          setIsLoading(false);
        } finally {
          setIsLoading(true);
        }
      } else {
        toast.error(
          "No hay resultados de búsqueda disponibles, verifique que este seleccionando una cuenta."
        );
      }
    };

    loadTableData();
  }, [searchResults]);

  const mapResponseToTableData = (response) => {
    return response.map((item) => ({
      Fecha: JSON.stringify(item.Fecha_Insert || "--"),
      Hora: JSON.stringify(item.Segundo_Insert || "--"),
      Ejecutivo: JSON.stringify(item.Ejecutivo || "--"),
      Dato: JSON.stringify(item.Dato || "--"),
      DatoBuscado: JSON.stringify(item.DatoBuscado || "--"),
      Fuente: JSON.stringify(item.Fuente || "--"),
      Encontrado: JSON.stringify(item._Encontrado === "✓" ? "Sí" : "No"),
      Telefonos: JSON.stringify(item.Teléfonos || "--"),
      Persona:
        typeof item.Persona === "string" && item.Persona.trim() !== ""
          ? JSON.stringify(item.Persona)
          : JSON.stringify("--"),
      Puesto:
        typeof item.Puesto === "string" && item.Puesto.trim() !== ""
          ? JSON.stringify(item.Puesto)
          : JSON.stringify("--"),
      Lugar:
        typeof item.Lugar === "string" && item.Lugar.trim() !== ""
          ? JSON.stringify(item.Lugar)
          : JSON.stringify("--"),
      idEjecutivo: JSON.stringify(item.idEjecutivo || "--"),
      InfoEncontrada:
        item.InfoEncontrada && Object.keys(item.InfoEncontrada).length > 0
          ? JSON.stringify(item.InfoEncontrada)
          :"--",
      Confirmado: JSON.stringify(item._Confirmado === "✓" ? "Sí" : "No"),
      Link:
        typeof item.Link === "string" && item.Link.trim() !== ""
          ? JSON.stringify(item.Link.replace("string", " "))
          : JSON.stringify("--"),
      idDato: JSON.stringify(item.idDato || "--")
    }));
  };

  const FormatInfo = ({ info }) => {
    if (!info || info === "--") return "--";

    try {
      const parsedInfo = typeof info === "string" ? JSON.parse(info) : info;
      if (Object.keys(parsedInfo).length === 0) return "--";

      return (
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {Object.entries(parsedInfo).map(([key, value]) => (
            <li key={key}>{`${key}: ${value}`}</li>
          ))}
        </ul>
      );
    } catch {
      return "--";
    }
  };

  return (
    <>
      {isLoading === false ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <div className="scroll-search">
          <Table className="table table-dark table-hover">
            <thead
              className="sticky-header"
              style={{
                position: "sticky",
                top: 0,

                zIndex: 1
              }}
            >
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Ejecutivo</th>
                <th>Dato</th>
                <th>Dato Buscado</th>
                <th>Fuente</th>
                <th>Encontrado</th>
                <th>Teléfonos</th>
                <th>Persona</th>
                <th>Puesto</th>
                <th>Lugar</th>
                <th>idEjecutivo</th>
                <th>Info Encontrada</th>
                <th>Confirmado</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Fecha.replace("T00:00:00", " ")}</td>
                  <td>{item.Hora}</td>
                  <td>{item.Ejecutivo}</td>
                  <td>{item.Dato}</td>
                  <td>{item.DatoBuscado}</td>
                  <td>{item.Fuente}</td>
                  <td>{item.Encontrado}</td>
                  <td>{item.Telefonos}</td>
                  <td>{item.Persona}</td>
                  <td>{item.Puesto}</td>
                  <td>{item.Lugar}</td>
                  <td>{item.idEjecutivo}</td>
                  <td>
                    <FormatInfo info={item.InfoEncontrada} />
                  </td>
                  <td>{item.Confirmado}</td>
                  <td>{item.Link}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default SearchTable;
