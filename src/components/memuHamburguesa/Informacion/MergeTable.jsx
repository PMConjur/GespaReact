import { useState, useEffect, useContext } from "react"; // Agregar useContext
import { Table, Container } from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";
import { AppContext } from "../../../pages/Managment"; // Importar el contexto

const MergeTable = ({ onRowSelect, setIsIdentifyButtonDisabled }) => {
    const { searchResults } = useContext(AppContext); // Obtener el contexto
    const [postalData, setPostalData] = useState([]);
    const [domicilioData, setDomicilioData] = useState([]);
    const [domicilioDataWithPostal, setDomicilioDataWithPostal] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Variables necesarias
    const codigoPostal = "52400"; // Código postal fijo para el ejemplo
    const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null; // Obtener idCuenta del contexto

    useEffect(() => {
        if (idCuenta) { // Verificar que idCuenta no sea null
            fetchPostalData();
            fetchDomicilioData();
        }
    }, [idCuenta]);

    useEffect(() => {
        if (postalData.length > 0 && domicilioData.length > 0) {
            compararCodigosPostales(); // Llamar a la función cuando ambos datos estén disponibles
        }
    }, [postalData, domicilioData]);

    const fetchPostalData = async () => {
        try {
            setIsLoading(true);
            const response = await servicio.get(`/search-customer/search-postal-code?codigoPostal=${codigoPostal}`);
            setPostalData(response.data.codigosPostales || []);
        } catch (error) {
            console.error("Error al obtener datos de códigos postales:", error);
            toast.error("No se pudieron cargar los datos de códigos postales.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDomicilioData = async () => {
        try {
            setIsLoading(true);
            const response = await servicio.get(`/search-customer/domicilios-visitas?idCartera=1&idCuenta=${idCuenta}`);
            setDomicilioData(response.data.domicilios || []);
        } catch (error) {
            console.error("Error al obtener datos de domicilios:", error);
            toast.error("No se pudieron cargar los datos de domicilios.");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para comparar y relacionar los datos de códigos postales con domicilios
    const compararCodigosPostales = () => {
        const updatedDomicilios = domicilioData.map((domicilio) => {
            const match = postalData.find(
                (postal) => postal.idCódigoPostal === domicilio.idCódigoPostal
            );

            return {
                ...domicilio,
                códigoPostal: match ? match.códigoPostal : "--", // Actualizar con el código postal correcto
                municipio: match ? match.municipio : "--", // Actualizar con el municipio correcto
                estado: match ? match.estado : "--", // Actualizar con el estado correcto
            };
        });

        setDomicilioDataWithPostal(updatedDomicilios);
    };

    // Función para manejar la selección de un row
    const handleRowClick = (item) => {
        console.log("Fila seleccionada en Tabla de Domicilios con Datos Correctos:", item);

        // Preparar los datos para actualizar el formulario
        const selectedData = {
            calle: item.calle || "",
            numExt: item.númeroExterior || "",
            numInt: item.númeroInterior || "",
            codigoPostal: item.códigoPostal || "",
            colonia: item.coloniaLocalidad || "",
            municipio: item.municipio || "",
            estado: item.estado || "",
            origen: item.orígen || "Gestión",
            idClase: item.clase || "",
            idInformacion: item.información || "",
            isEstadoVisible: item.información === "Sin verificar", // Mostrar dropdown si está "Sin verificar"
            idDomicilio: item.idDomicilio || "",
            fecha: "0", // Usar 0 como valor predeterminado para Fecha_Insert
        };

        // Llamar a la función pasada como prop para actualizar el formulario
        onRowSelect(selectedData);

        // Mostrar un mensaje informativo
        if (item.información === "Sin verificar") {
            toast.info("Seleccione una información para identificar.");
        } else {
            toast.info(`Información actual: ${item.información}`);
        }
    };

    return (
        <Container>
            {true && ( // Ocultar tabla de códigos postales
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID Código Postal</th>
                            <th>Código Postal</th>
                            <th>Colonia</th>
                            <th>Municipio</th>
                            <th>Estado</th>
                            <th>Zona</th>
                            <th>Asentamiento</th>
                            <th>Periferia</th>
                            <th>Estancia</th>
                            <th>Sucursal</th>
                            <th>Zona de Riesgo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postalData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.idCódigoPostal}</td>
                                <td>{item.códigoPostal}</td>
                                <td>{item.colonia}</td>
                                <td>{item.municipio}</td>
                                <td>{item.estado}</td>
                                <td>{item.zona}</td>
                                <td>{item.asentamiento}</td>
                                <td>{item.periferia}</td>
                                <td>{item.estancia}</td>
                                <td>{item.sucursal}</td>
                                <td>{item.zonaRiesgo ? "Sí" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {false && ( // Ocultar tabla de domicilios
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID Domicilio</th>
                            <th>Calle</th>
                            <th>Número Exterior</th>
                            <th>Número Interior</th>
                            <th>ID Código Postal</th>
                            <th>Colonia/Localidad</th>
                            <th>Delegación/Municipio</th>
                            <th>Estado</th>
                            <th>Clase</th>
                            <th>Origen</th>
                            <th>Información</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domicilioData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.idDomicilio}</td>
                                <td>{item.calle}</td>
                                <td>{item.númeroExterior}</td>
                                <td>{item.númeroInterior || "N/A"}</td>
                                <td>{item.idCódigoPostal}</td>
                                <td>{item.coloniaLocalidad}</td>
                                <td>{item.delegaciónMunicipio || "N/A"}</td>
                                <td>{item.estado}</td>
                                <td>{item.clase}</td>
                                <td>{item.orígen}</td>
                                <td>{item.información}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <h3>Tabla de Domicilios con Datos Correctos</h3>
            <div
                className="scroll-container"
                style={{
                    width: "100%",
                    maxHeight: "250px",
                    overflowY: "auto",
                    display: "flex",
                    backgroundColor: "#343a40",
                    color: "#ffffff",
                    scrollbarColor: "#6c757d #343a40",
                    scrollbarWidth: "thin",
                }}
            >
                <Table
                    striped
                    bordered
                    hover
                    responsive
                    variant="dark"
                    style={{ fontSize: "13px" }}
                >
                    <thead
                        style={{
                            position: "sticky",
                            top: -1,
                            zIndex: 1,
                            backgroundColor: "#343a40",
                        }}
                    >
                        <tr style={{ height: "55px" }}>
                            <th>Calle</th>
                            <th>N.Exterior</th>
                            <th>N.Interior</th>
                            <th>C.Postal</th>
                            <th>Colonia</th>
                            <th>Municipio</th>
                            <th>Estado</th>
                            <th>Clase</th>
                            <th>Orígen</th>
                            <th>Información</th>
                            <th>idDomicilio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domicilioDataWithPostal.map((item, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowClick(item)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{item.calle}</td>
                                <td>{item.númeroExterior}</td>
                                <td>{item.númeroInterior || "N/A"}</td>
                                <td>{item.códigoPostal}</td>
                                <td>{item.coloniaLocalidad}</td>
                                <td>{item.municipio}</td>
                                <td>{item.estado}</td>
                                <td>{item.clase}</td>
                                <td>{item.orígen}</td>
                                <td>{item.información}</td>
                                <td>{item.idDomicilio}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default MergeTable;
