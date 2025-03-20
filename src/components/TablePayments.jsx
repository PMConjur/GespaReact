import React, { useState, useCallback, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";

const TablePayments = ({ data, customColumnNames = {} }) => {
    const [sortedData, setSortedData] = useState(data || []);
    const [sortByOldest, setSortByOldest] = useState(false);

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    if (!data || data.length === 0) {
        toast.error("Error 428: Primero debes buscar una Cuenta");
        return <p>No hay datos disponibles.</p>;
    }

    // 🔹 Campos que NO se mostrarán en la tabla
    const hiddenFields = [
        "idCartera",
        "idCuenta"
    ];

    // 🔹 Nombres de columnas por defecto (se pueden sobrescribir con `customColumnNames`)
    const defaultColumnNames = {
        "FechaPago": "Fecha",
        "MontoPago": "Monto",
        "Referencia": "Referencia",
        "Sucursal": "Sucursal",
        "Reportado": "Reportado",
        "idEtapa": "Etapa",
        "AcornPostDate": "Acorn Post Date",
        "Guardado": "Guardado"
    };

    // 🔹 Lista de campos a los que se les agregará el signo "$" con formato de miles
    const currencyFields = ["MontoPago"];

    // 🔹 Combina los nombres personalizados con los predeterminados
    const columnNames = { ...defaultColumnNames, ...customColumnNames };

    // 🔹 Ordenar por fecha (más antiguo/más reciente)
    const handleSortChange = useCallback(() => {
        setSortByOldest(prev => !prev);
        setSortedData(prevData =>
            !sortByOldest
                ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                : [...data] // Restaurar datos originales si se desmarca el checkbox
        );
    }, [sortByOldest, data]);

    // 🔹 Filtrar claves de los datos, excluyendo los campos ocultos
    const headers = Object.keys(data[0]).filter(header => !hiddenFields.includes(header));

    return (
        <>
            <Form.Check
                type="checkbox"
                id="sortByOldest"
                label="Más antiguo"
                className="mb-3"
                checked={sortByOldest}
                onChange={handleSortChange}
            />
            <div style={{
                maxHeight: "400px",  // Altura máxima del contenedor
                overflowY: "auto",   // Scroll vertical si es necesario
                overflowX: "auto",   // Scroll horizontal si es necesario
                width: "100%",       // Que la tabla use el ancho disponible
            }}>
                <Table striped bordered hover responsive variant="dark">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>
                                    {columnNames[header] || header.replace(/_/g, " ")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header) => {
                                    let value = item[header];

                                    // 🔹 Formatear campos de moneda con "$" y separadores de miles
                                    if (currencyFields.includes(header) && typeof value === "number") {
                                        value = `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    }

                                    // 🔹 Formatear Vencimiento -> Solo YYYY-MM-DD
                                    if (header === "FechaPago", "Guardado" && typeof value === "string" && value.includes("T")) {
                                        value = value.split("T")[0];
                                    }

                                    return (
                                        <td key={header}>
                                            {header === "Fecha_Insert"
                                                ? item[header].split("T")[0] // Extrae solo la fecha
                                                : typeof item[header] === "object" && Object.keys(item[header]).length === 0
                                                    ? "--" // Si el valor es un objeto vacío, mostrar "--"
                                                    : value ?? "--"}
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
