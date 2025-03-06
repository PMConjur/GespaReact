import React, { useState, useCallback } from "react";
import { Table, Form } from "react-bootstrap";

const TableFollowUps = ({ data }) => {
    const [sortedData, setSortedData] = useState(data || []);
    const [sortByOldest, setSortByOldest] = useState(false);

    if (!data || data.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    const hiddenFields = ["idCartera", "idCuenta", "Fecha_Insert", "Segundo_Insert", "idEjecutivo", "idEjecutivoRealizado"];
    const columnNames = {
        "FechaSeguimiento": "Fecha de Seguimiento",
        "SegundoSeguimiento": "Hora de Seguimiento",
        "idAcercamiento": "Acercamiento",
        "NúmeroTelefónico": "Número Telefónico",
        "Ejecutivo": "Ejecutivo",
        "_Realizado": "Realizado"
    };

    const handleSortChange = useCallback(() => {
        console.log("Ordenando por fecha más antigua:", sortByOldest);
        setSortByOldest(prev => !prev);
        setSortedData(prevData =>
            !sortByOldest
                ? [...prevData].sort((a, b) => new Date(a.FechaSeguimiento) - new Date(b.FechaSeguimiento))
                : [...data]
        );
    }, [sortByOldest, data]);

    const headers = Object.keys(data[0]).filter(header => !hiddenFields.includes(header));

    return (
        <>
            <Form.Check
                type="checkbox"
                id="sortByOldest"
                label="Más antiguo"
                className="mb-3"
                checked={sortByOldest}
                onChange={handleSortChange} // ✅ Asegurar que está en uso
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
                                    {header === "FechaSeguimiento"
                                        ? item[header].split("T")[0]
                                        : typeof item[header] === "object"
                                        ? JSON.stringify(item[header])
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
