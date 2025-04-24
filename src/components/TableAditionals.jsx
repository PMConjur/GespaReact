import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Table, Form, Spinner } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getAditionalsData } from "../services/gespawebServices";
import { reemplazarValores } from "./ValoresCatalogos.js"; // Importa el método

const TableAditionals = ({ customColumnNames = {} }) => {
  const { searchResults } = useContext(AppContext); // Hook 1
  const [sortedData, setSortedData] = useState([]); // Hook 2
  const [sortByOldest, setSortByOldest] = useState(false); // Hook 3
  const [toastShown, setToastShown] = useState(false); // Hook 4
  const [loading, setLoading] = useState(true);
  const hasShownToast = useRef(false);

  // NUEVO: Función para emitir el número del item seleccionado usando "Numero" o, en su defecto, el índice
  const handleItemClick = (NúmeroTelefónico) => {
    window.dispatchEvent(new CustomEvent("itemSelected", { detail: NúmeroTelefónico }));
  };

  // Hook 5: useEffect para obtener datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!searchResults || searchResults.length === 0) {
        if (!hasShownToast.current) {
          toast.error("Error 428: Primero debes buscar una Cuenta");
          hasShownToast.current = true;
        }
        setLoading(false);
        return;
      }

      try {
        const idCuenta = searchResults[0]?.idCuenta; // Obtener el primer idCuenta como ejemplo
        if (!idCuenta) {
          toast.error("No se encontró un idCuenta válido.");
          setLoading(false);
          return;
        }

        const aditionalsData = await getAditionalsData(1, idCuenta); // idCartera fijo como 1
        setSortedData(aditionalsData);
        // NUEVO: Si hay datos, emitir el evento con el "Numero" del primer item (o índice si no existe)
if (aditionalsData.length > 0) {
        handleItemClick(aditionalsData[0].númeroTelefónico || 0);
        }
      } catch (error) {
        console.error("Error al obtener los datos de Adicionales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchResults]);

  // Hook 6: useCallback para manejar el ordenamiento
  const handleSortChange = useCallback(() => {
    if (!toastShown) {
      setSortByOldest((prev) => !prev);
      setSortedData((prevData) => {
        const sorted = !sortByOldest
          ? [...prevData].sort(
              (a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert)
            )
          : [...sortedData]; // Restaurar datos originales si se desmarca el checkbox

        toast.success(
          !sortByOldest
            ? "Datos ordenados por fecha más antigua."
            : "Orden original restaurado."
        );
        setToastShown(true);
        setTimeout(() => setToastShown(false), 2000);
        return sorted;
      });
    }
  }, [sortByOldest, sortedData, toastShown]);

  
  if (loading) {
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Cargando datos...</span>
        </div>
    );
  }

  if (!sortedData || sortedData.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }


  // 🔹 Campos que NO se mostrarán en la tabla
  const hiddenFields = [];

  // 🔹 Nombres de columnas por defecto (se pueden sobrescribir con `customColumnNames`)
  const defaultColumnNames = {
    NombreAdicional: "Nombre",
    idParentesco: "Parentesco",
    NúmeroTelefónico: "Teléfono",
    CorreoAdicional: "Correo",
    RFCAdicional: "RFC",
    Domiclio: "Domicilio",
  };

  // 🔹 Lista de campos a los que se les agregará el signo "$" con formato de miles
  const currencyFields = [];

  // 🔹 Combina los nombres personalizados con los predeterminados
  const columnNames = { ...defaultColumnNames, ...customColumnNames };

  // 🔹 Filtrar claves de los datos, excluyendo los campos ocultos
  const headers =
    Array.isArray(sortedData) &&
    sortedData.length > 0 &&
    sortedData[0] &&
    typeof sortedData[0] === "object"
      ? Object.keys(sortedData[0]).filter(
          (header) => !hiddenFields.includes(header)
        )
      : [];

  return (
    <>
    <div
      className="scroll-container"
      style={{
        overflowX: "hhidden",
        overflowY: "auto",
        width: "100%",
        height: "100%", // Asegura que ocupe todo el espacio del contenedor padre
        maxHeight: "100%", // No exceder la altura del contenedor padre
      }}
    >
        <Table
          striped
          bordered
          hover
          responsive
          variant="dark"
          style={{ fontSize: "13px"
            }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#343a40",
            }} // Encabezado fijo
          >
            <tr style={{ height: "55px" }}>
              {" "}
              {/* Reducimos la altura de los encabezados */}
              {headers.map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "4px",
                    minHeight: "20px",
                    textAlign: "center",
                  }}
                >
                  {columnNames[header] || header.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            style={{
              width: "100%", // 🔹 Evita que la tabla se desconfigure
            }}
          >
            {sortedData.map((item, index) => (
              <tr
                key={index}
                style={{ height: "24px", cursor: "pointer" }}
                onClick={() => handleItemClick(item.NúmeroTelefónico || index)} // NUEVO: Se emite el evento con el identificador
              >
                {" "}
                {/* Reducimos la altura de cada fila */}
                {headers.map((header) => {
                  let value = item[header];

                  // 🔹 Aplicar reemplazarValores para idParentesco
                  if (header === "idParentesco") {
                    value = reemplazarValores(value);
                  }

                  // 🔹 Manejo de valores nulos o no definidos
                  if (
                    value === null ||
                    value === undefined ||
                    (typeof value === "object" &&
                      Object.keys(value).length === 0)
                  ) {
                    value = "--";
                  }

                  // 🔹 Enmascarar números: mostrar solo los últimos 4 dígitos
                  const strValue = String(value);
                  if (/^\d+$/.test(strValue) && strValue.length > 4) {
                    value = "X".repeat(strValue.length - 4) + strValue.slice(-4);
                  }

                  return (
                    <td
                      key={header}
                      style={{
                        padding: ".7rem",
                        minHeight: "20px",
                        textAlign: "center",
                        overflowY: "hidden",
                      }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default TableAditionals;
