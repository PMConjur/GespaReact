import React, { useState, useCallback,useEffect } from "react";
import { Table, Form } from "react-bootstrap";

const TableFollowUps = ({ data, customColumnNames = {} }) => {
    const [sortedData, setSortedData] = useState(data || []);
    const [sortByOldest, setSortByOldest] = useState(false);

    useEffect(() => {
            setSortedData(data);
        }, [data]);

    if (!data || data.length === 0) {
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
    "Herramienta": "Acercamiento",
    "idAcercamiento": "Acercamiento", // Renombrar sin el "id"
    "NúmeroTelefónico": "Telefono",
    "Ofreció": "Ejecutivo",
    "_Realizado": "Realizado"
};

// 🔹 Aplicar estilos para que la tabla se ajuste al tamaño del texto
// const tableStyle = {
//     tableLayout: "auto",
//     whiteSpace: "nowrap",
//     width: "100%"
// };


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
                            {headers.map((header) => (
                                <td key={header}>
                                    {header === "Fecha_Insert"
                                        ? item[header].split("T")[0] // Extrae solo la fecha
                                        : typeof item[header] === "object" && Object.keys(item[header]).length === 0
                                        ? "--" // Si el valor es un objeto vacío, mostrar "--"
                                        : item[header] ?? "--"} 
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default TableFollowUps;
