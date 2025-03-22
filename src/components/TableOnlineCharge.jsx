import { useState, useCallback, useEffect, useContext } from "react";
import { Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { getOnlinechargeData } from "../services/gespawebServices";


const TableOnlineCharge = ({ customColumnNames = {} }) => {
    const { searchResults } = useContext(AppContext); // Hook 1
    const [sortedData, setSortedData] = useState([]); // Hook 2
    const [sortByOldest, setSortByOldest] = useState(false); // Hook 3
    const [toastShown, setToastShown] = useState(false); // Hook 4

    // Hook 5: useEffect para obtener datos
    useEffect(() => {
        const fetchData = async () => {
            if (!searchResults || searchResults.length === 0) {
                toast.error("Error 428: Primero debes buscar una Cuenta");
                return;
            }

            try {
                const idCuenta = searchResults[0]?.idCuenta; // Obtener el primer idCuenta como ejemplo
                if (!idCuenta) {
                    toast.error("No se encontró un idCuenta válido.");
                    return;
                }

                const onlineChargeData = await getOnlinechargeData(1, idCuenta); // idCartera fijo como 1
                setSortedData(onlineChargeData);
            } catch (error) {
                console.error("Error al obtener los datos de Cargos ne Linea:", error);
            }
        };

        fetchData();
    }, [searchResults]);

    // Hook 6: useCallback para manejar el ordenamiento
    const handleSortChange = useCallback(() => {
        if (!toastShown) {
            setSortByOldest(prev => !prev);
            setSortedData(prevData => {
                const sorted = !sortByOldest
                    ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
                    : [...sortedData]; // Restaurar datos originales si se desmarca el checkbox

                toast.success(
                    !sortByOldest
                        ? "Datos ordenados por fecha más antigua."
                        : "Orden original restaurado."
                );
                setToastShown(true);
                setTimeout(() => setToastShown(false), 2000);
                return sorted;
            });
        }
    }, [sortByOldest, sortedData, toastShown]);

    if (!sortedData || sortedData.length === 0) {
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

    // 🔹 Filtrar claves de los datos, excluyendo los campos ocultos
    const headers = Array.isArray(sortedData) && sortedData.length > 0 && sortedData[0] && typeof sortedData[0] === "object"
    ? Object.keys(sortedData[0]).filter(header => !hiddenFields.includes(header))
    : [];
        

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