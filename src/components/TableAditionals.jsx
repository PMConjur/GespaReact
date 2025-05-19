import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Table, Spinner } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getAditionalsData, fetchPhones, getGestionTeData } from "../services/gespawebServices"; // Importa fetchPhones y getGestionTeData
import { reemplazarValores } from "./ValoresCatalogos.js"; // Importa el método

const TableAditionals = ({ customColumnNames = {}, onRowClick, selectedAnswer, autoSelect = true, handleCloseAditionals }) => {
  const { searchResults, setUserActiveFlow, setSelectedAnswer } = useContext(AppContext);
  const [sortedData, setSortedData] = useState([]);
  const [phoneData, setPhoneData] = useState([]); // Estado para almacenar los datos de teléfonos
  const [sortByOldest, setSortByOldest] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const hasShownToast = useRef(false);

  // NUEVO: Función para emitir acción por defecto o flujo con teléfono
  const handleItemClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      window.dispatchEvent(new CustomEvent("itemSelected", { detail: row.NúmeroTelefónico || 0 }));
    }
  };

  // NUEVO: Función para cargar los datos de teléfonos
  const loadPhoneData = async () => {
    if (!searchResults || searchResults.length === 0) {
      if (!hasShownToast.current) {
        toast.error("Error 428: Primero debes buscar una Cuenta");
        hasShownToast.current = true;
      }
      return;
    }

    try {
      const phones = await Promise.all(
        searchResults.map(async (result) => {
          const response = await fetchPhones(result.idCuenta);
          console.log("Datos de teléfonos:", response); // Verifica los datos obtenidos
          return response;
        })
      );
      const flatPhones = phones.flat();
      console.log("Teléfonos planos:", flatPhones); // Verifica los datos planos
      setPhoneData(flatPhones || []); // Almacena los datos en el estado
    } catch (error) {
      console.error("Error cargando teléfonos:", error);
      setPhoneData([]); // En caso de error, asegura que sea un arreglo vacío
    }
  };

  // NUEVO: Función que activa el flujo al hacer clic en el enlace del teléfono
  const handlePhoneFlow = async (row, e) => {
    e.preventDefault();
    setUserActiveFlow(true);

    console.log("Teléfono seleccionado:", row["NúmeroTelefónico"]);

    const normalizedSelectedPhone = String(row["NúmeroTelefónico"]).replace(/\D/g, "");
    const idCartera = searchResults?.[0]?.idCartera;
    const idCuenta = searchResults?.[0]?.idCuenta;

    if (!idCartera || !idCuenta) {
      console.error("Faltan idCartera o idCuenta.");
      toast.error("Error: No se pudo obtener idCartera o idCuenta.");
      return;
    }

    let idModo = null;
    try {
      const gestionData = await getGestionTeData(idCartera, idCuenta);
      const selectedGestion = gestionData.find(
        (gestion) => String(gestion.NúmeroTelefónico).replace(/\D/g, "") === normalizedSelectedPhone
      );
      idModo = selectedGestion?.idModo || null;
      console.log("idModo obtenido:", idModo);
    } catch (error) {
      console.error("Error obteniendo idModo:", error);
    }

    let idClase = null;
    try {
      const phoneData = await fetchPhones(idCuenta);
      const selectedPhone = phoneData.find(
        (phone) => String(phone.númeroTelefónico).replace(/\D/g, "") === normalizedSelectedPhone
      );
      idClase = selectedPhone?.idClase || null;
      console.log("idClase obtenido:", idClase);
    } catch (error) {
      console.error("Error obteniendo idClase:", error);
    }

    if (!idModo || !idClase) {
      console.warn("No se encontró idModo o idClase.");
      toast.error("Error: No se pudo obtener el idModo o idClase.");
      return;
    }

    setSelectedAnswer({
      value: 2,
      dataPhone: {
        númeroTelefónico: row["NúmeroTelefónico"],
        idClase: idClase,
        idModo: idModo
      }
    });

    if (handleCloseAditionals) {
      handleCloseAditionals();
    }
  };

  // Hook para cargar los datos de teléfonos al montar el componente
  useEffect(() => {
    loadPhoneData();
  }, [searchResults]);

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
        console.log("Datos de adicionales:", aditionalsData); // Verifica los datos obtenidos

        // Asegúrate de que idModo esté presente en los datos
        aditionalsData.forEach((item) => {
          console.log(`idModo para ${item.NúmeroTelefónico}:`, item.idModo);
        });

        setSortedData(aditionalsData);
        // NUEVO: Si hay datos, emitir el evento con el "Numero" del primer item (o índice si no existe)
        if (aditionalsData.length > 0 && autoSelect) {
          handleItemClick(aditionalsData[0]);
        }
      } catch (error) {
        console.error("Error obteniendo adicionales:", error);
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
          width: "100%",
          maxHeight: "300px",
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
                onClick={() => handleItemClick(item)} // NUEVO: Se emite el evento con el identificador
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
                      {header === "NúmeroTelefónico" ? (
                        <a
                          href="#"
                          onClick={(e) => handlePhoneFlow(item, e)}
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
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
