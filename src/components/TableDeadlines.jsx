import { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getDeadlineData } from "../services/gespawebServices";

const TableDeadlines = ({ selectedTalk }) => {
    const { searchResults } = useContext(AppContext);
    const [deadlinesData, setDeadlinesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!searchResults || searchResults.length === 0) {
                return;
            }

            try {
                const idCuenta = searchResults[0]?.idCuenta;
                if (!idCuenta) {
                    toast.error("No se encontró un idCuenta válido.");
                    return;
                }

                const plazosData = await getDeadlineData(1, idCuenta);
                setDeadlinesData(plazosData);
                
                console.log("Todos los plazos obtenidos:", plazosData);
            } catch (error) {
                console.error("Error al obtener los datos de Plazos:", error);
            }
        };

        fetchData();
    }, [searchResults]);

    useEffect(() => {
        if (!selectedTalk || deadlinesData.length === 0) {
            setFilteredData([]);
            return;
        }

        console.log("Negociación seleccionada para filtrar:", selectedTalk);
        
        // Crear el filtro combinando Fecha_Insert y Segundo_Insert como en el código original
        const fechaInsert = selectedTalk.Fecha_Insert ? 
            selectedTalk.Fecha_Insert.substring(0, 10) : '';
        const segundoInsert = selectedTalk.Segundo_Insert || '';
        
        const filterDateTime = `${fechaInsert} ${segundoInsert}`;
        console.log("Filtro datetime:", filterDateTime);

        // Filtrar los plazos que coincidan con esta fecha/hora
        const filtered = deadlinesData.filter(plazo => {
            const plazoFechaInsert = plazo.Fecha_Insert ? 
                plazo.Fecha_Insert.substring(0, 10) : '';
            const plazoHoraInsert = plazo.Segundo_Insert || '';
            
            return `${plazoFechaInsert} ${plazoHoraInsert}` === filterDateTime;
        });

        console.log("Plazos filtrados:", filtered);
        setFilteredData(filtered);

    }, [selectedTalk, deadlinesData]);

    const hiddenFields = [
        "Fecha_Insert",
        "Segundo_Insert",
        "FechaInicioPlazo",
        "FechaFinPlazo",
        "_Válido"
    ];

    const defaultColumnNames = {
        "FechaPago": "Fecha de Pago",
        "MontoPago": "Monto",
        "_Cumplido": "Cumplido"
    };

    const currencyFields = ["MontoPago"];

    const headers = Array.isArray(filteredData) && filteredData.length > 0 && filteredData[0] && typeof filteredData[0] === "object"
        ? Object.keys(filteredData[0]).filter(header => !hiddenFields.includes(header))
        : [];

    if (!selectedTalk) {
        return <p style={{ padding: '20px', textAlign: 'center' }}>Seleccione una negociación para ver los plazos</p>;
    }

    if (filteredData.length === 0) {
        return (
            <p style={{ padding: '20px', textAlign: 'center' }}>
                No hay plazos registrados para esta negociación
            </p>
        );
    }


    return (
        <div 
            className="scroll-container" 
            style={{ 
                width: '100%', 
                maxHeight: '500px', 
                overflowY: 'auto', 
                scrollbarWidth: 'thin',
                scrollbarColor: '#495057 #343a40'
            }}
        >
            <Table striped bordered hover responsive variant="dark" style={{ 
                fontSize: "13px",
                marginBottom: 0
            }}>
                <thead style={{ 
                    position: "sticky", 
                    top: 0, 
                    zIndex: 1, 
                    backgroundColor: "#343a40",
                    borderColor: "#454d55"
                }}>
                    <tr style={{ height: "55px" }}>
                        {headers.map((header) => (
                            <th key={header} style={{ 
                                padding: "4px", 
                                minHeight: "20px", 
                                textAlign: "center",
                                borderColor: "#454d55"
                            }}>
                                {defaultColumnNames[header] || header.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ width: "100%" }}>
                    {filteredData.map((item, index) => (
                        <tr key={index} style={{ 
                            height: "24px",
                            borderColor: "#454d55"
                        }}>
                            {headers.map((header) => {
                                let value = item[header];

                                if (header === "FechaPago" && typeof value === "string" && value.includes("T")) {
                                    value = value.split("T")[0];
                                }

                                if (currencyFields.includes(header) && typeof value === "number") {
                                    value = `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }

                                if (header === "_Cumplido") {
                                    value = value === 1 ? "Sí" : "No";
                                }

                                if (value === null || value === undefined) {
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
                                            borderColor: "#454d55"
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
    );
};

export default TableDeadlines;