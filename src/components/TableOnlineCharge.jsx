import React, { useState, useCallback, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";


const TableOnlineCharge = ({ data, customColumnNames = {} }) => {
    const [sortedData, setSortedData] = useState(data || []);
    const [sortByOldest, setSortByOldest] = useState(false);

    useEffect(() => {
        setSortedData(data);
    }, [data]);
    

       // ✅ Nueva función para manejar el estado de la cuenta
    const handleAccountStatement = useCallback(() => {
        if (!data || data.length === 0) {
            toast.error("Error 428: Primero debes buscar una Cuenta.");
            return;
        }
        setSortedData(data);
    }, [data]);

    useEffect(() => {
        handleAccountStatement();
    }, [handleAccountStatement]);


    if (!data || data.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    // Campos que NO se mostrarán en la tabla
    const hiddenFields = [
        
        
        
    ];

    // Nombres de columnas por defecto (se pueden sobrescribir con `customColumnNames`)
    const defaultColumnNames = {
        "Fecha_Insert": "Fecha",
        "Segundo_Insert": "Hora",
        "Nombre": "Nombre",
        "Tarjeta": "Tarjeta",
        "Vencimiento": "Vencimiento",
        "idBanco" : "Banco",
        "MontoCargo": "Cargo",
        "_Autorizado" :"Autorizado",
        "Autorizaci\u00F3n": "Autorización",
        "Ejecutivo": "Ejecutivo",
        "Usuario" : "Usuario",
        "Autoriz\u00F3" : "Autorizó",
        "_EsClabe" : "EsClabe",
        "_Domiciliado" : "Domiciliado",
        "Status" : "Status",
        "Motivo" : "Motivo",

    };

    // Combina los nombres personalizados con los predeterminados
    const columnNames = { ...defaultColumnNames, ...customColumnNames };

    // Ordenar por fecha (más antiguo/más reciente)
    const handleSortChange = useCallback(() => {
        setSortByOldest(prev => !prev);
        setSortedData(prevData =>
            !sortByOldest
                ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                : [...data] // Restaurar datos originales si se desmarca el checkbox
        );
    }, [sortByOldest, data]);

    // Filtrar claves de los datos, excluyendo los campos ocultos
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
            </div>
        </>
    );
};

export default TableOnlineCharge;