// import React, { useState, useCallback } from "react";
// import { Table, Form } from "react-bootstrap";

// const TableTalks = ({ data }) => {
//     const [sortedData, setSortedData] = useState(data || []);
//     const [sortByOldest, setSortByOldest] = useState(false);

//     if (!data || data.length === 0) {
//         return <p>No hay datos disponibles.</p>;
//     }

//     // ✅ Campos que queremos ocultar en la tabla
//     const hiddenFields = ["Segundo_Insert", "idEstado", "Vencimiento", "MontoPagado", "Plazos", "Validó", "_CartaConvenio", "Remanente"];

//     // ✅ Renombrar los encabezados de la tabla
//     const columnNames = {
//         "Fecha_Insert": "Fecha de Registro",
//         "FechaHora": "Fecha y Hora",
//         "idHerramienta": "ID Herramienta",
//         "Herramienta": "Herramienta",
//         "Saldo": "Saldo",
//         "Descuento": "Descuento (%)",
//         "MontoRequerido": "Monto Requerido",
//         "MontoNegociado": "Monto Negociado",
//         "SaldoInterés": "Saldo con Interés",
//         "Ofreció": "Ejecutivo Ofertante"
//     };

//     // ✅ Función para ordenar por fecha más antigua o más reciente
//     const handleSortChange = useCallback(() => {
//         console.log("Ordenando por fecha más antigua:", sortByOldest);
//         setSortByOldest(prev => !prev);
//         setSortedData(prevData =>
//             !sortByOldest
//                 ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
//                 : [...data]
//         );
//     }, [sortByOldest, data]);

//     // ✅ Filtrar columnas visibles
//     const headers = Object.keys(data[0]).filter(header => !hiddenFields.includes(header));

//     return (
//         <>
//             {/* ✅ Checkbox para ordenar por el registro más antiguo */}
//             <Form.Check
//                 type="checkbox"
//                 id="sortByOldest"
//                 label="Más antiguo"
//                 className="mb-3"
//                 checked={sortByOldest}
//                 onChange={handleSortChange}
//             />

//             <Table striped bordered hover responsive variant="dark">
//                 <thead>
//                     <tr>
//                         {headers.map((header) => (
//                             <th key={header}>
//                                 {columnNames[header] || header.replace(/_/g, " ")}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {sortedData.map((item, index) => (
//                         <tr key={index}>
//                             {headers.map((header) => (
//                                 <td key={header}>
//                                     {header === "Fecha_Insert" || header === "FechaHora"
//                                         ? item[header].split("T")[0] // ✅ Formatear fecha eliminando "T00:00:00"
//                                         : typeof item[header] === "object"
//                                         ? JSON.stringify(item[header]) // ✅ Manejar objetos anidados
//                                         : item[header] ?? "--"}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </>
//     );
// };

// export default TableTalks;
