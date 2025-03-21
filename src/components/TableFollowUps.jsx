import { useState, useCallback, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner"; // Importar toast

const TableFollowUps = ({ data, customColumnNames = {} }) => {
    const [sortedData, setSortedData] = useState(data || []);
    const [sortByOldest, setSortByOldest] = useState(false);
    const [toastShown, setToastShown] = useState(false); // Estado para controlar si el toast ya se mostró

    // Validar si no hay `nuCuenta` al abrir el modal
    useEffect(() => {
        if (!data || data.length === 0) {
            if (!toastShown) {
                toast.error("Error 428: Primero debes buscar una Cuenta");
                setToastShown(true); // Marcar que el toast ya se mostró
            }
        } else {
            if (toastShown) {
                setToastShown(false); // Resetear el estado si los datos están disponibles
            }
        }
    }, [data, toastShown]);

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
        "NúmeroTelefónico": "Telefono",
        "idContacto": "Contacto",
        "idSituación": "Situacion",
        "NombreContacto": "Nombre",
        "Herramienta": "Acercamiento",
        "idAcercamiento": "Acercamiento", // Renombrar sin el "id"
        "Ofreció": "Ejecutivo",
        "_Realizado": "Realizado"
    };

    // 🔹 Combina los nombres personalizados con los predeterminados
    const columnNames = { ...defaultColumnNames, ...customColumnNames };

    // 🔹 Ordenar por fecha (más antiguo/más reciente)
    const handleSortChange = useCallback(() => {
        if (!toastShown) { // Evitar mostrar múltiples toasts
            setSortByOldest(prev => !prev);
            setSortedData(prevData => {
                const sorted = !sortByOldest
                    ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                    : [...data]; // Restaurar datos originales si se desmarca el checkbox

                toast.success(
                    !sortByOldest
                        ? "Datos ordenados por fecha más antigua."
                        : "Orden original restaurado."
                );
                setToastShown(true); // Marcar que el toast ya se mostró
                setTimeout(() => setToastShown(false), 2000); // Resetear después de 2 segundos
                return sorted;
            });
        }
    }, [sortByOldest, data, toastShown]);

    // 🔹 Filtrar claves de los datos, excluyendo los campos ocultos
    const headers = Object.keys(data[0]).filter(header => !hiddenFields.includes(header));

    return (
        <>
            <Form.Check
                type="switch"
                id="sortByOldest"
                label="Más antiguo"
                className="mb-3"
                checked={sortByOldest}
                onChange={handleSortChange}
            />
            <div style={{
                maxHeight: "400px",  // Altura máxima del contenedor
                   // Scroll horizontal si es necesario
                width: "100%",       // Que la tabla use el ancho disponible
            }}>


                <Table striped bordered hover responsive variant="dark">
                    <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#343a40" }}> {/* Encabezado fijo */}
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

export default TableFollowUps;