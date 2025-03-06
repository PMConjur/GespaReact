import React from "react";
import { Table } from "react-bootstrap";

const TableFollowUps = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    // Extraer las llaves del primer objeto para los encabezados
    const headers = Object.keys(data[0]);

    return (
        <Table striped bordered hover responsive variant="dark">
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header.replace(/_/g, " ")}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {headers.map((header) => (
                            <td key={header}>
                                {/* ✅ Evitar el error asegurándonos de que el valor no es un objeto */}
                                {typeof item[header] === "object"
                                    ? JSON.stringify(item[header]) // Convierte objetos en JSON legible
                                    : item[header] ?? "--"}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TableFollowUps;
