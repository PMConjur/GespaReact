import { useState, useCallback, useEffect, useContext } from "react";
import { Table, Spinner, Form } from "react-bootstrap"; // Importa Spinner para la animación de carga
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getPaymentsData } from "../services/gespawebServices";
import { reemplazarValores } from "./ValoresCatalogos.js"; // Importa el método

const TablePayments = ({ customColumnNames = {} }) => {
  const { searchResults } = useContext(AppContext); // Hook 1
  const [sortedData, setSortedData] = useState([]); // Hook 2
  const [sortByOldest, setSortByOldest] = useState(false); // Hook 3
  const [toastShown, setToastShown] = useState(false); // Hook 4
  const [loading, setLoading] = useState(true); // Hook 5: Estado para la animación de carga

  // Hook 6: useEffect para obtener datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Mostrar animación de carga
      if (!searchResults || searchResults.length === 0) {
        toast.error("Error 428: Primero debes buscar una Cuenta");
        setLoading(false); // Ocultar animación de carga
        return;
      }

      try {
        const idCuenta = searchResults[0]?.idCuenta; // Obtener el primer idCuenta como ejemplo
        if (!idCuenta) {
          toast.error("No se encontró un idCuenta válido.");
          setLoading(false); // Ocultar animación de carga
          return;
        }

        const paymentsData = await getPaymentsData(1, idCuenta); // idCartera fijo como 1
        setSortedData(paymentsData);
      } catch (error) {
        console.error("Error al obtener los datos de Pagos:", error);
      } finally {
        setLoading(false); // Ocultar animación de carga
      }
    };

    fetchData();
  }, [searchResults]);
  

  // Hook 7: useCallback para manejar el ordenamiento
  const handleSortChange = useCallback(() => {
    setSortByOldest((prev) => {
      const newSortByOldest = !prev; // Invertir el estado del switch
      setSortedData((prevData) => {
        const sorted = newSortByOldest
          ? [...prevData].sort(
              (a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert)
            )
          : [...prevData].sort(
              (a, b) => new Date(b.Fecha_Insert) - new Date(a.Fecha_Insert)
            ); // Ordenar por fecha más reciente si el switch está desactivado

        toast.success(
          newSortByOldest
            ? "Datos ordenados por fecha más antigua."
            : "Datos ordenados por fecha más reciente."
        );
        return sorted;
      });
      return newSortByOldest;
    });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        
        <span className="ms-2">Cargando datos...</span>
      </div>
    );
  }

  if (!sortedData || sortedData.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  // 🔹 Campos que NO se mostrarán en la tabla
  const hiddenFields = ["idCartera", "idCuenta", "SucursalValor", "idEtapa"];

  // 🔹 Nombres de columnas por defecto (se pueden sobrescribir con `customColumnNames`)
  const defaultColumnNames = {
    FechaPago: "Fecha",
    MontoPago: "Monto",
    Referencia: "Referencia",
    idSucursal: "Sucursal",
    Reportado: "Reportado",
    idEtapa: "Etapa",
    AcornPostDate: "Acorn Post Date",
    Guardado: "Guardado",
  };

  // 🔹 Lista de campos a los que se les agregará el signo "$" con formato de miles
  const currencyFields = ["MontoPago"];

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
      <Form.Check
        type="switch"
        id="sortByOldest"
        label="Más antiguo"
        className="mb-2"
        checked={sortByOldest}
        onChange={handleSortChange}
      />

      <div
        className="scroll-container"
        style={{
          width: "100%",
          maxHeight: "500px",
          overflowY: "auto",
          display: "flex",
          backgroundColor: "#343a40", // Fondo oscuro
          color: "#ffffff", // Texto claro
          scrollbarColor: "#6c757d #343a40", // Colores del scroll
          scrollbarWidth: "thin", // Scroll más delgado
        }}
      >
        <Table
          striped
          bordered
          hover
          responsive
          variant="dark"
          style={{ fontSize: "13px" }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#343a40",
            }}
          >
            {/* Encabezado fijo */}
            <tr style={{ height: "55px" }}>
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
              <tr key={index} style={{ height: "24px" }}>
                {/* Reducimos la altura de cada fila */}
                {headers.map((header) => {
                  let value = item[header];

                  // 🔹 Aplicar reemplazarValores para Sucursal
                  if (header === "Sucursal") {
                    value = reemplazarValores(value);
                  }

                  // 🔹 Aplicar reemplazarValores para idEtapa
                  if (header === "idEtapa") {
                    value = reemplazarValores(value);
                  }

                  // 🔹 Formatear campos de moneda con "$" y separadores de miles
                  if (
                    currencyFields.includes(header) &&
                    typeof value === "number"
                  ) {
                    value = `$${value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;
                  }

                  // 🔹 Formatear FechaPago y Guardado -> Solo YYYY-MM-DD
                  if (
                    (header === "FechaPago" || header === "Guardado") &&
                    typeof value === "string" &&
                    value.includes("T")
                  ) {
                    value = value.split("T")[0];
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

                  return (
                    <td
                      key={header}
                      style={{
                        padding: ".7rem",
                        minHeight: "20px",
                        textAlign: "center",
                        whiteSpace: "nowrap", // 🔹 Evita saltos de línea
                        overflow: "hidden", // 🔹 Oculta contenido desbordado
                        textOverflow: "ellipsis", // 🔹 Agrega puntos suspensivos si el texto es muy largo
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

export default TablePayments;