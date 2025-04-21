import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getFollowUpsData } from "../services/gespawebServices";

const TableFollowUps = ({ customColumnNames = {}, refreshTrigger }) => {
    const { searchResults } = useContext(AppContext);
    const [sortedData, setSortedData] = useState([]);
    const [sortByOldest, setSortByOldest] = useState(false);
    const [toastShown, setToastShown] = useState(false);

    const toastShownRef = useRef(false); // Referencia para rastrear si el toast ya se mostró

    useEffect(() => {
        const fetchData = async () => {
            if (!searchResults || searchResults.length === 0) {
                if (!toastShownRef.current) { // Solo mostrar si no se ha mostrado antes
                    toast.error("Error 428: Primero debes buscar una Cuenta");
                    toastShownRef.current = true; // Marcar como mostrado
                }
                return;
            }
    
            try {
                const idCuenta = searchResults[0]?.idCuenta;
                if (!idCuenta) {
                    toast.error("No se encontró un idCuenta válido.");
                    return;
                }
    
                const followUpsData = await getFollowUpsData(1, idCuenta);
                // Ordenar de más reciente a más antiguo por defecto
                setSortedData([...followUpsData].sort((a, b) => new Date(b.Fecha_Insert) - new Date(a.Fecha_Insert)));
                toastShownRef.current = false; // Resetear para futuras búsquedas
            } catch (error) {
                console.error("Error al obtener los datos de seguimiento:", error);
            }
        };
    
        fetchData();
    }, [searchResults, refreshTrigger]);

    const handleSortChange = useCallback(() => {
        if (!toastShown) {
            setSortByOldest(prev => {
                const newSortByOldest = !prev;
                setSortedData(prevData => 
                    newSortByOldest
                    ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                    : [...prevData].sort((a, b) => new Date(b.Fecha_Insert) - new Date(a.Fecha_Insert))
                );
                toast.success(
                    newSortByOldest
                        ? "Ordenados de más antiguo a más reciente."
                        : "Ordenados de más reciente a más antiguo."
                );
                setToastShown(true);
                setTimeout(() => setToastShown(false), 2000);
                return newSortByOldest;
            });
        }
    }, [toastShown]);

    if (!sortedData || sortedData.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    const hiddenFields = [
        "idCartera",
        "idCuenta",
        "idEjecutivo",
        "idEjecutivoRealizado",
        "FechaSeguimiento",
        "SegundoSeguimiento"
    ];

    const defaultColumnNames = {
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

    const columnNames = { ...defaultColumnNames, ...customColumnNames };

    const headers = Array.isArray(sortedData) && sortedData.length > 0 && sortedData[0] && typeof sortedData[0] === "object"
        ? Object.keys(sortedData[0]).filter(header => !hiddenFields.includes(header))
        : [];

    // Función para formatear el número telefónico
    const formatPhoneNumber = (phone) => {
        if (!phone) return '--';
        const phoneStr = String(phone);
        return phoneStr.length > 4 
            ? 'X'.repeat(phoneStr.length - 4) + phoneStr.slice(-4)
            : phoneStr;
    };

    // Función para formatear la hora con AM/PM
    const formatTimeWithAMPM = (timeString) => {
        if (!timeString) return '--';
        
        try {
            // Si ya tiene AM/PM, no hacer cambios
            if (/(AM|PM)/i.test(timeString)) return timeString;
            
            // Extraer solo la parte de la hora (en caso de que sea un datetime)
            const timePart = timeString.includes('T') 
                ? timeString.split('T')[1].split('.')[0] 
                : timeString;
            
            // Convertir a formato AM/PM
            const [hours, minutes, seconds] = timePart.split(':');
            const hourInt = parseInt(hours, 10);
            
            const period = hourInt >= 12 ? 'PM' : 'AM';
            const standardHour = hourInt % 12 || 12; // Convierte 0 a 12 AM
            
            return `${standardHour}:${minutes} ${period}`;
        } catch (e) {
            console.error("Error formateando hora:", e);
            return timeString; // Si hay error, devolver el valor original
        }
    };

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
                    width: '100%', 
                    maxHeight: '500px',
                    overflowY: 'auto', 
                    display: 'flex', 
                    backgroundColor: '#343a40',
                    color: '#ffffff',
                    scrollbarColor: '#6c757d #343a40',
                    scrollbarWidth: 'thin'
                }}
            >
                <Table striped bordered hover responsive variant="dark" style={{ fontSize: "13px", width: "100%" }}>
                    <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#343a40" }}>
                        <tr style={{ height: "55px" }}>
                            {headers.map((header) => (
                                <th key={header} style={{ padding: "4px", minHeight: "20px", textAlign: "center" }}>
                                    {columnNames[header] || header.replace(/_/g, " ")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                        {sortedData.map((item, index) => (
                            <tr key={index} style={{ height: "24px" }}>
                                {headers.map((header) => {
                                    let value = item[header];

                                    if (header === "Fecha_Insert" && typeof value === "string" && value.includes("T")) {
                                        value = value.split("T")[0];
                                    }

                                                        // Formatear hora con AM/PM
                                    if (header === "Segundo_Insert") {
                                        value = formatTimeWithAMPM(value);
                                    }

                                    if (value === null || value === undefined || (typeof value === "object" && Object.keys(value).length === 0)) {
                                        value = '--';
                                    }

                                    // Aplicar formato especial solo para el campo de teléfono
                                    if (header === "NúmeroTelefónico") {
                                        value = formatPhoneNumber(value);
                                    }

                                    return (
                                        <td key={header} 
                                            style={{ 
                                                padding: ".7rem", 
                                                minHeight: "20px", 
                                                textAlign: "center", 
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
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