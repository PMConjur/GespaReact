import React, { useState, useCallback, useEffect } from "react";
import { Table, Form } from "react-bootstrap";

const TableTalks = ({ dataTalks, customColumnNames }) => {
    const [sortedData, setSortedData] = useState(dataTalks || []);
    const [sortByOldest, setSortByOldest] = useState(false);

    useEffect(() => {
        setSortedData(dataTalks);
    }, [dataTalks]);

    if (!dataTalks || dataTalks.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    // ✅ Campos que queremos ocultar en la tabla
    const hiddenFieldstalks = [
        "Fecha_Insert",
        "Segundo_Insert",
        "idHerramienta"
    ];

    // ✅ Renombrar los encabezados de la tabla
    const defaultColumnNames = {
        "FechaHora": "Fecha y Hora",
        "Herramienta": "Herramienta",
        "idEstado": "Estado",
        "Vencimiento": "Vencimiento",
        "Saldo": "Saldo",
        "Descuento": "Descuento (%)",
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

    // ✅ Función para ordenar por fecha más antigua o más reciente
    const handleSortChange = useCallback(() => {
        console.log("Ordenando por fecha más antigua:", sortByOldest);
        setSortByOldest(prev => !prev);
        setSortedData(prevData =>
            !sortByOldest
                ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                : [...dataTalks]
        );
    }, [sortByOldest, dataTalks]);

    // ✅ Filtrar columnas visibles
    console.log("Datos recibidos en TableTalks:", dataTalks);

    const headers = Object.keys(dataTalks[0]).filter(header => !hiddenFieldstalks.includes(header));

    return (
        <>
            {/* ✅ Checkbox para ordenar por el registro más antiguo */}
            <Form.Check
                type="checkbox"
                id="sortByOldest"
                label="Más antiguo"
                className="mb-2"
                checked={sortByOldest}
                onChange={handleSortChange}
            />

            <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                
                  // 🔹 Permite el scroll sin afectar la tabla
            }}>       
                <Table striped bordered hover responsive variant="dark" style={{ fontSize: "13px" }}>
                    <thead>
                        <tr style={{ height: "25px" }}> {/* Reducimos la altura de los encabezados */}
                            {headers.map((header) => (
                                <th key={header} style={{ padding: "4px", minHeight: "20px", textAlign: "center" }}>
                                    {columnNames[header] || header.replace(/_/g, " ")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{
                            // 🔹 Altura máxima para el scroll
                        overflow: "auto",   // 🔹 Scroll SIEMPRE visible
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
                                                overflow: "hidden",
                                                textAlign: "center",
                                                whiteSpace: "normal",
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
                                                padding: "3px", 
                                                minHeight: "20px", 
                                                textAlign: "center", 
                                                lineHeight: "1.1" 
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
