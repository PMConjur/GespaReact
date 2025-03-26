import { useState, useCallback, useEffect, useContext } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getTalksData } from "../services/gespawebServices";

const TableTalks = ({ customColumnNames = {} }) => {
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

                const talksData = await getTalksData(1, idCuenta); // idCartera fijo como 1
                setSortedData(talksData);
            } catch (error) {
                console.error("Error al obtener los datos de Negociaciones:", error);
            }
        };

        fetchData();
    }, [searchResults]);

    // Hook 6: useCallback para manejar el ordenamiento
    const handleSortChange = useCallback(() => {
        if (!toastShown) {
            setSortByOldest(prev => !prev);
            setSortedData(prevData => {
                const sorted = !sortByOldest
                    ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
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

    // ✅ Campos que queremos ocultar en la tabla
    const hiddenFieldstalks = [
        "Fecha_Insert",
        "Segundo_Insert",
        "idHerramienta",
        "idEstado"
    ];

    // ✅ Renombrar los encabezados de la tabla
    const defaultColumnNames = {
        "FechaHora": "Fecha y Hora",
        "Herramienta": "Herramienta",
        "idEstado": "Estado",
        "Vencimiento": "Vencimiento",
        "Saldo": "Saldo",
        "Descuento": " (%)Descuento",
        "MontoRequerido": "Requerido",
        "MontoNegociado": "Negociado",
        "MontoPagado": "Pagado",
        "Plazos": "Plazos",
        "Ofreció": "Ofertante",
        "Validó": "Validador",
        "_CartaConvenio": "Carta Convenio",
        "SaldoInterés": "Saldo con Interés",
        "Remanente": "Remanente",
    };

    // 🔹 Combina los nombres personalizados con los predeterminados
    const columnNames = { ...defaultColumnNames, ...customColumnNames };

    // 🔹 Lista de campos a los que se les agregará el signo "$" con formato de miles
    const currencyFields = ["Saldo", "MontoRequerido", "MontoNegociado", "MontoPagado", "SaldoInterés", "Remanente"];


    // 🔹 Filtrar claves de los datos, excluyendo los campos ocultos
    const headers = Array.isArray(sortedData) && sortedData.length > 0 && sortedData[0] && typeof sortedData[0] === "object"
    ? Object.keys(sortedData[0]).filter(header => !hiddenFieldstalks.includes(header))
    : [];
        
    
    return (
        <>
            {/*  Checkbox para ordenar por el registro más antiguo */}
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
                    maxHeight: '500px', 
                    overflowY: 'auto', 
                    display: 'flex', 
                    backgroundColor: '#343a40', // Fondo oscuro
                    color: '#ffffff',          // Texto claro
                    scrollbarColor: '#6c757d #343a40', // Colores del scroll
                    scrollbarWidth: 'thin'    // Scroll más delgado
                }}
            >
                <Table striped bordered hover responsive variant="dark" style={{ fontSize: "13px" }}>
                    <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#343a40" }}> {/* Encabezado fijo */}
                        <tr style={{ height: "55px" }}> {/* Reducimos la altura de los encabezados */}
                            {headers.map((header) => (
                                <th key={header} style={{ padding: "4px", minHeight: "20px", textAlign: "center" }}>
                                    {columnNames[header] || header.replace(/_/g, " ")}
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

                                    // 🔹 Formatear FechaHora en dos filas con estilos compactos
                                    if (header === "FechaHora" && typeof value === "string" && value.includes("T")) {
                                        const date = new Date(value);
                                        if (!isNaN(date.getTime())) {
                                            const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
                                            const hours = date.getHours().toString().padStart(2, "0");
                                            const minutes = date.getMinutes().toString().padStart(2, "0");
                                            value = (
                                                <div style={{ 
                                                    whiteSpace: "nowrap", 
                                                    textAlign: "center", 
                                                    minWidth: "100px", 
                                                    maxWidth: "120px",
                                                    padding: "2px", 
                                                    lineHeight: "1.1"
                                                }}>
                                                    {formattedDate} <br /> {hours}:{minutes} hrs
                                                </div>
                                            );
                                        }
                                    }

                                    // 🔹 Formatear Ofertante y Validador en máximo 2 filas
                                    if ((header === "Ofreció" || header === "Validó") && typeof value === "string") {
                                        value = (
                                            <div style={{
                                                maxHeight: "35px",
                                            
                                                textAlign: "center",
                                                whiteSpace: "nowrap",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical"
                                            }}>
                                                {value}
                                            </div>
                                        );
                                    }

                                    // 🔹 Formatear Vencimiento -> Solo YYYY-MM-DD
                                    if (header === "Vencimiento" && typeof value === "string" && value.includes("T")) {
                                        value = value.split("T")[0];
                                    }

                                    // 🔹 Formatear campos de moneda con "$" y separadores de miles
                                    if (currencyFields.includes(header) && typeof value === "number") {
                                        value = `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    }

                                    // 🔹 Agregar "%" al campo de Descuento
                                    if (header === "Descuento" && typeof value === "number") {
                                        value = `${value.toFixed(2)}%`;
                                    }

                                    // 🔹 Manejo de valores nulos o no definidos
                                    if (value === null || value === undefined || (typeof value === "object" && Object.keys(value).length === 0)) {
                                        value = "--";
                                    }

                                    return (
                                        <td key={header} 
                                            style={{ 
                                                padding: "20px", 
                                                minHeight: "20px", 
                                                textAlign: "center", 
                                                lineHeight: "1.5", 
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

export default TableTalks;
