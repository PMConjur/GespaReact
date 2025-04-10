import { useState, useCallback, useEffect, useContext } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getOnlinechargeData } from "../services/gespawebServices";
import { reemplazarValores } from "./ValoresCatalogos.js"; // Importa el método

const TableOnlineCharge = ({ customColumnNames = {} }) => {
  const { searchResults } = useContext(AppContext); // Hook 1
  const [sortedData, setSortedData] = useState([]); // Hook 2
  const [sortByOldest, setSortByOldest] = useState(false); // Hook 3
  const [toastShown, setToastShown] = useState(false); // Hook 4


    // Función para formatear la hora con AM/PM
    const formatTimeWithAMPM = (timeString) => {
      if (!timeString) return '--';
      
      try {
        // Si ya tiene AM/PM, devolver tal cual
        if (/(AM|PM)/i.test(timeString)) return timeString;
        
        // Extraer solo la parte de la hora
        const timePart = timeString.includes('T') 
          ? timeString.split('T')[1].split('.')[0] 
          : timeString;
        
        const [hours, minutes] = timePart.split(':');
        const hourInt = parseInt(hours, 10);
        
        const period = hourInt >= 12 ? 'PM' : 'AM';
        const standardHour = hourInt % 12 || 12;
        
        return `${standardHour}:${minutes} ${period}`;
      } catch (e) {
        console.error("Error formateando hora:", e);
        return timeString;
      }
    };

  // Hook 5: useEffect para obtener datos
  useEffect(() => {
    const fetchData = async () => {
      if (!searchResults || searchResults.length === 0) {
        toast.error("Error 428: Primero debes buscar una Cuenta");
        return;
      }

      try {
        const idCuenta = searchResults[0]?.idCuenta; // Obtener el primer idCuenta como ejemplo
        if (!idCuenta) {
          toast.error("No se encontró un idCuenta válido.");
          return;
        }

        const onlineChargeData = await getOnlinechargeData(1, idCuenta); // idCartera fijo como 1
        setSortedData(onlineChargeData);
      } catch (error) {
        console.error("Error al obtener los datos de Cargos ne Linea:", error);
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

  if (!sortedData || sortedData.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }
  // Campos que NO se mostrarán en la tabla
  const hiddenFields = ["idBanco"];

  // Nombres de columnas por defecto (se pueden sobrescribir con `customColumnNames`)
  const defaultColumnNames = {
    Fecha_Insert: "Fecha",
    Segundo_Insert: "Hora",
    Nombre: "Nombre",
    Tarjeta: "Tarjeta",
    Vencimiento: "Vencimiento",
    Banco: "Banco",
    MontoCargo: "Cargo",
    "Autorizaci\u00F3n": "Autorización",
    _Autorizó: "Autorizó",
    Ejecutivo: "Ejecutivo",
    Usuario: "Usuario",
    _EsClabe: "EsClabe",
    _Domiciliado: "Domiciliado",
    Status: "Status",
    Motivo: "Motivo",
  };

  // Combina los nombres personalizados con los predeterminados
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
                {headers.map((header) => {
                  let value = item[header];

                  // 🔹 Formatear Fecha_Insert en una sola línea
                  if (
                    header === "Fecha_Insert" &&
                    typeof value === "string" &&
                    value.includes("T")
                  ) {
                    value = value.split("T")[0];
                  }

                                    // Aplicar formato AM/PM al campo Hora (Segundo_Insert)
                  if (header === "Segundo_Insert") {
                    value = formatTimeWithAMPM(value);
                  }

                  // 🔹 Aplicar reemplazarValores para idBanco
                  if (header === "idBanco") {
                    value = reemplazarValores(value);
                  }

                  // 🔹 Agregar símbolo de dólar al MontoCargo
                  if (header === "MontoCargo" && value !== "--") {
                    value = `$${value}`;
                  }

                  // 🔹 Manejo de valores nulos o no definidos
                  if (
                    value === null ||
                    value === undefined ||
                    (typeof value === "object" && Object.keys(value).length === 0)
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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

export default TableOnlineCharge;
