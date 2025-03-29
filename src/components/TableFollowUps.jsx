import { useState, useCallback, useEffect, useContext } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getFollowUpsData } from "../services/gespawebServices";

const TableFollowUps = ({ customColumnNames = {} }) => {
    const { searchResults } = useContext(AppContext); // Hook 1
    const [sortedData, setSortedData] = useState([]); // Hook 2
    const [sortByOldest, setSortByOldest] = useState(false); // Hook 3
    const [toastShown, setToastShown] = useState(false); // Hook 4

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

                const followUpsData = await getFollowUpsData(1, idCuenta); // idCartera fijo como 1
                setSortedData(followUpsData);
            } catch (error) {
                console.error("Error al obtener los datos de seguimiento:", error);
            }
        };

        fetchData();
    }, [searchResults]);

    // Hook para manejar el ordenamiento
    const handleSortChange = useCallback(() => {
        if (!toastShown) {
            setSortByOldest((prev) => !prev);
            setSortedData((prevData) => {
                const sorted = !sortByOldest
                    ? [...prevData].sort(
                        (a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert)
                    )
                    : [...prevData].sort(
                        (a, b) => new Date(b.Fecha_Insert) - new Date(a.Fecha_Insert)
                    );

                toast.success(
                    !sortByOldest
                        ? "Datos ordenados por fecha más antigua."
                        : "Datos ordenados por fecha más reciente."
                );
                setToastShown(true);
                setTimeout(() => setToastShown(false), 2000);
                return sorted;
            });
        }
    }, [sortByOldest, toastShown]);

    if (!sortedData || sortedData.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    // 🔹 Campos que NO se mostrarán en la tabla
    const hiddenFields = [
        "idCartera",
        "idCuenta",
        "idEjecutivo",
        "idEjecutivoRealizado",
        "FechaSeguimiento",
        "SegundoSeguimiento"
    ];

    // 🔹 Nombres de columnas por defecto (se pueden sobrescribir con `customColumnNames`)
    const defaultColumnNames = {
        "Fecha_Insert": "Fecha",
        "Segundo_Insert": "Hora",
        "NúmeroTelefónico": "Telefono",
        "idContacto": "Contacto",
        "idSituación": "Situacion",
        "NombreContacto": "Nombre",
        "Herramienta": "Acercamiento",
        "idAcercamiento": "Acercamiento", // Renombrar sin el "id"
        "Ofreció": "Ejecutivo",
        "_Realizado": "Realizado"
    };

    // 🔹 Combina los nombres personalizados con los predeterminados
    const columnNames = { ...defaultColumnNames, ...customColumnNames };

    // 🔹 Función para renombrar los campos
    const renameField = (field) => {
        const fieldMappings = {
            "Fecha_Insert": "Fecha",
            "Segundo_Insert": "Hora",
            "NúmeroTelefónico": "Teléfono",
            "idContacto": "Contacto",
            "idSituación": "Situación",
            "NombreContacto": "Nombre",
            "Herramienta": "Acercamiento",
            "idAcercamiento": "Acercamiento",
            "Ofreció": "Ejecutivo",
            "_Realizado": "Realizado"
        };
        return fieldMappings[field] || field;
    };

    // 🔹 Filtrar claves de los datos, excluyendo los campos ocultos
    const headers = Array.isArray(sortedData) && sortedData.length > 0 && sortedData[0] && typeof sortedData[0] === "object"
        ? Object.keys(sortedData[0]).filter(header => !hiddenFields.includes(header))
        : [];

    return (
        <>
            {/* Checkbox para ordenar por el registro más antiguo */}
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
                    width: '100%',
                    height: '100%', // Asegurar que ocupe todo el espacio del contenedor
                    maxHeight: '680px', // Ajustar la altura máxima para que coincida con FormFollowUps
                    overflowY: 'auto',
                    backgroundColor: '#343a40', // Fondo oscuro
                    color: '#ffffff',          // Texto claro
                    scrollbarColor: '#6c757d #343a40', // Colores del scroll
                        // Scroll más delgado
                }}
            >
                <Table striped bordered hover responsive variant="dark" style={{ fontSize: "13px", margin: 0 }}>
                    <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#343a40" }}> {/* Encabezado fijo */}
                        <tr style={{ height: "55px" }}> {/* Reducimos la altura de los encabezados */}
                            {headers.map((header) => (
                                <th key={header} style={{ padding: "4px", minHeight: "20px", textAlign: "center" }}>
                                    {renameField(header)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{
                        width: "100%"          // 🔹 Evita que la tabla se desconfigure
                    }}>
                        {sortedData.map((item, index) => (
                            <tr key={index} style={{ height: "24px" }}> {/* Reducimos la altura de cada fila */}
                                {headers.map((header) => {
                                    let value = item[header];

                                    // 🔹 Formatear Fecha_Insert en formato YYYY-MM-DD en una sola fila
                                    if (header === "Fecha_Insert" && typeof value === "string" && value.includes("T")) {
                                        value = value.split("T")[0];
                                    }

                                    // 🔹 Limitar el nombre del ejecutivo a un máximo de 2 filas
                                    if (header === "Ofreció" && typeof value === "string") {
                                        value = (
                                            <div style={{
                                                maxHeight: "35px",
                                                textAlign: "center",
                                                whiteSpace: "nowrap",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}>
                                                {value}
                                            </div>
                                        );
                                    }

                                    // 🔹 Manejo de valores nulos o no definidos
                                    if (value === null || value === undefined || (typeof value === "object" && Object.keys(value).length === 0)) {
                                        value = "--";
                                    }

                                    return (
                                        <td key={header}
                                            style={{
                                                padding: ".7rem",
                                                minHeight: "20px",
                                                textAlign: "justify",
                                                lineHeight: "1",
                                                ...(header === "Fecha_Insert" && { whiteSpace: "nowrap", width: "15%" }) // Ajuste para extender la fecha
                                            }}>
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

export default TableFollowUps;