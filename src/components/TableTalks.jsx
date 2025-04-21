import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getTalksData } from "../services/gespawebServices";

const TableTalks = ({ customColumnNames = {}, onRowClick }) => {
    const { searchResults } = useContext(AppContext);
    const [sortedData, setSortedData] = useState([]);
    const [sortByOldest, setSortByOldest] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const toastShownRef = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!searchResults || searchResults.length === 0) {
                if (!toastShownRef.current) {
                    toast.error("Error 428: Primero debes buscar una Cuenta");
                    toastShownRef.current = true;
                }
                return;
            }
    
            try {
                const idCuenta = searchResults[0]?.idCuenta;
                if (!idCuenta) {
                    toast.error("No se encontró un idCuenta válido.");
                    return;
                }
    
                const talksData = await getTalksData(1, idCuenta);
                // Ordenar de más reciente a más antiguo
                setSortedData([...talksData].sort((a, b) => new Date(b.Fecha_Insert) - new Date(a.Fecha_Insert)));
                toastShownRef.current = false;
                
                // Debug: mostrar datos obtenidos
                console.log("Datos de negociaciones obtenidos:", talksData);
            } catch (error) {
                console.error("Error al obtener los datos de Negociaciones:", error);
            }
        };
    
        fetchData();
    }, [searchResults]);

    const handleSortChange = useCallback(() => {
        if (toastShown) return;
        
        setToastShown(true);
        setSortByOldest(prev => !prev);
        
        setSortedData(prevData => {
            const sorted = !sortByOldest
                ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                : [...prevData];
            
            return sorted;
        });
    
        toast.success(
            !sortByOldest
                ? "Datos ordenados por fecha más antigua."
                : "Orden original restaurado."
        );
        
        const timer = setTimeout(() => {
            setToastShown(false);
        }, 1);
        
        return () => clearTimeout(timer);
    }, [sortByOldest, toastShown]);

    const handleRowClick = (rowData, index) => {
        setSelectedRow(index);
        if (onRowClick) {
            // Enviamos el objeto completo de la negociación
            onRowClick(rowData);
            console.log("Negociación seleccionada para filtrar:", {
                Fecha_Insert: rowData.Fecha_Insert,
                Segundo_Insert: rowData.Segundo_Insert,
                idHerramienta: rowData.idHerramienta
            });
        }
    };

    if (!sortedData || sortedData.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    const hiddenFieldstalks = [
        "Fecha_Insert",
        "Segundo_Insert",
        "idHerramienta",
        "idEstado"
    ];

    const defaultColumnNames = {
        "FechaHora": "Fecha y Hora",
        "Herramienta": "Herramienta",
        "Estado": "Status",
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

    const columnNames = { ...defaultColumnNames, ...customColumnNames };
    const currencyFields = ["Saldo", "MontoRequerido", "MontoNegociado", "MontoPagado", "SaldoInterés", "Remanente"];

    const headers = Array.isArray(sortedData) && sortedData.length > 0 && sortedData[0] && typeof sortedData[0] === "object"
    ? Object.keys(sortedData[0]).filter(header => !hiddenFieldstalks.includes(header))
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
                <Table striped bordered hover responsive variant="dark" style={{ fontSize: "13px" }}>
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
                            <tr 
                                key={index} 
                                style={{ 
                                    height: "24px",
                                    backgroundColor: selectedRow === index ? '#495057' : 'inherit',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleRowClick(item, index)}
                            >
                                {headers.map((header) => {
                                    let value = item[header];

                                    if (header === "FechaHora" && typeof value === "string" && value.includes("T")) {
                                        const date = new Date(value);
                                        if (!isNaN(date.getTime())) {
                                            const formattedDate = date.toISOString().split("T")[0];
                                            const hours = date.getHours().toString().padStart(2, "0");
                                            const minutes = date.getMinutes().toString().padStart(2, "0");
                                            value = `${formattedDate} ${hours}:${minutes} hrs`;
                                        }
                                    }

                                    if (currencyFields.includes(header) && typeof value === "number") {
                                        value = `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    }

                                    if (header === "Descuento" && typeof value === "number") {
                                        value = `${value.toFixed(2)}%`;
                                    }

                                    if (header === "Vencimiento" && typeof value === "string" && value.includes("T")) {
                                        value = value.split("T")[0];
                                    }

                                    if (value === null || value === undefined || (typeof value === "object" && Object.keys(value).length === 0)) {
                                        value = "--";
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

export default TableTalks;