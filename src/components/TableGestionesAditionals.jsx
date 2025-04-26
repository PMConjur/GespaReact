import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Toast } from "react-bootstrap";
import { AppContext } from "../pages/Managment"; // Importar el contexto
import { getGestionTeData } from "../services/gespawebServices"; // Importar el endpoint
import { toast } from "sonner"; // Importar la librería sonner
import { ClockHistory } from "react-bootstrap-icons";

const Managments = () => {
    const { searchResults } = useContext(AppContext); // Consumir el contexto
    const [sortedData, setSortedData] = useState([]); // Estado para los datos ordenados
    const [selectedGestion, setSelectedGestion] = useState(null); // Estado para el registro seleccionado
    const [showToast, setShowToast] = useState(false); // Estado para mostrar el toast
    const [toastMessage, setToastMessage] = useState(""); // Mensaje dinámico para el toast
    const [currentPage, setCurrentPage] = useState(1); // Página actual para la carga perezosa
    const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está cargando más data
    const [itemsPerPage] = useState(200); // Número de registros por página
    const [currentTablePage, setCurrentTablePage] = useState(1); // Página actual de la tabla
    const [paginationGroup, setPaginationGroup] = useState(0); // Grupo actual de 10 páginas
    const [totalResults, setTotalResults] = useState(10000); // Total de resultados requeridos (puede ser dinámico)
    const [selectedNumero, setSelectedNumero] = useState(null); // Estado para almacenar el "Numero" seleccionado

    // Escuchar el evento "itemSelected" para actualizar el estado
    useEffect(() => {
        const handleItemSelected = (e) => {
            console.log("TableAditionals - selección realizada:", e.detail); // Se agrega log de la selección
            setSelectedNumero(e.detail);
            setSelectedGestion(null); // Reinicia la selección para que el comentario se actualice a "Selecciona un registro."
        };
        window.addEventListener("itemSelected", handleItemSelected);
        return () => window.removeEventListener("itemSelected", handleItemSelected);
    }, []);

    useEffect(() => {
        console.log("TableAditionals - Contenido completo:", searchResults);
        console.log("TableAditionals - Opción seleccionada:", selectedNumero);
    }, [searchResults, selectedNumero]);

    // Función para calcular el número total de páginas basado en los resultados obtenidos
    const calculateTotalPages = (dataLength, itemsPerPage) => {
        return Math.ceil(dataLength / itemsPerPage);
    };

    // Hook para obtener los datos
    useEffect(() => {
        const fetchData = async () => {
            if (!searchResults || searchResults.length === 0) {
                setSortedData([]); // Limpiar datos si no hay resultados
                setTotalResults(0); // Ajustar totalResults a 0 si no hay datos
                setSelectedGestion(null); // Limpiar selección previa
                return;
            }

            try {
                const idCuenta = searchResults[0]?.idCuenta; // Obtener el primer idCuenta como ejemplo
                if (!idCuenta) {
                    setToastMessage("No se encontró un idCuenta válido.");
                    setShowToast(true);
                    setSortedData([]); // Limpiar datos si no hay idCuenta válido
                    setTotalResults(0); // Ajustar totalResults a 0 si no hay idCuenta válido
                    setSelectedGestion(null); // Limpiar selección previa
                    return;
                }

                // Limpiar estados antes de realizar la llamada
                setSortedData([]);
                setSelectedGestion(null);
                setCurrentTablePage(1); // Reiniciar la página actual de la tabla
                setPaginationGroup(0); // Reiniciar el grupo de paginación
                setIsLoading(true);

                const gestionData = await getGestionTeData(1, idCuenta); // Reiniciar a la página 1
                setSortedData(gestionData); // Actualizar datos con los nuevos resultados
                setTotalResults(gestionData.length); // Ajustar totalResults dinámicamente
                setIsLoading(false); // Finalizar carga
            } catch (error) {
                toast.error("Error al obtener los datos de gestión. Intente nuevamente."); // Mostrar toast de error
                setIsLoading(false); // Finalizar carga en caso de error
            }
        };

        // Reiniciar el estado cuando cambie searchResults
        setCurrentPage(1); // Reiniciar la página actual
        fetchData(); // Llamar a fetchData para cargar los nuevos datos
    }, [searchResults]);

    // Validar campos para evitar errores al renderizar
    const validateField = (field) => {
        if (field === null || field === undefined || field === "") {
            return "--";
        }
        if (typeof field === "object") {
            return Object.keys(field).length === 0 ? "--" : JSON.stringify(field); // Reemplazar {} por --
        }
        return field;
    };



    // Manejar la selección de un registro
    const handleRowClick = (gestion) => {
        const relatedGestiones = sortedData.filter(item => item.NúmeroTelefónico === gestion.NúmeroTelefónico);
        if (selectedGestion && selectedGestion.NúmeroTelefónico === gestion.NúmeroTelefónico) {
            console.log("Deseleccionado:", gestion);
            console.log("Gestiones relacionadas (deseleccionado):", relatedGestiones);
            setSelectedGestion(null);
        } else {
            console.log("Seleccionado:", gestion);
            console.log("Gestiones relacionadas:", relatedGestiones);
            setSelectedGestion(gestion);
        }
    };

    

    // Calcular el número total de páginas basado en los resultados obtenidos
    const totalPages = calculateTotalPages(totalResults, itemsPerPage);

    // Configuración del paginador
    const pagesPerGroup = 10;
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    const startPage = paginationGroup * pagesPerGroup + 1;
    const endPage = Math.min((paginationGroup + 1) * pagesPerGroup, totalPages);
    const visiblePages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );

    // Manejar el cambio de grupo de páginas
    const handleNextGroup = async () => {
        if (paginationGroup < totalGroups - 1) {
            setPaginationGroup(paginationGroup + 1);
            setCurrentTablePage((paginationGroup + 1) * pagesPerGroup + 1);

            // Cargar los siguientes 2000 resultados
            try {
                setIsLoading(true);
                const idCuenta = searchResults[0]?.idCuenta;
                const nextGroupData = await getGestionTeData(currentPage + 10, idCuenta); // Ajustar la página base
                setSortedData((prevData) => [...prevData, ...nextGroupData]);
                setTotalResults(totalResults + nextGroupData.length); // Actualizar el total dinámicamente
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar el siguiente grupo de datos:", error);
                setToastMessage("❌ Error al cargar el siguiente grupo de datos. Intente nuevamente.");
                setShowToast(true);
                setIsLoading(false);
            }
        }
    };

    const handlePrevGroup = () => {
        if (paginationGroup > 0) {
            setPaginationGroup(paginationGroup - 1);
            setCurrentTablePage((paginationGroup - 1) * pagesPerGroup + 1);
        }
    };

    // Manejar el cambio de página
    const handlePageChange = async (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentTablePage(pageNumber);

            // Actualizar el grupo si la página seleccionada está fuera del grupo actual
            const newGroup = Math.floor((pageNumber - 1) / pagesPerGroup);
            if (newGroup !== paginationGroup) {
                setPaginationGroup(newGroup);
            }

            // Cargar los datos de la página seleccionada
            try {
                setIsLoading(true);
                const idCuenta = searchResults[0]?.idCuenta;
                const pageData = await getGestionTeData(pageNumber, idCuenta);
                setSortedData(pageData); // Reemplazar los datos en lugar de concatenarlos
                setIsLoading(false);
            } catch (error) {
                console.error("Error al cargar los datos de la página:", error);
                setToastMessage("❌ Error al cargar los datos de la página. Intente nuevamente.");
                setShowToast(true);
                setIsLoading(false);
            }
        }
    };

    // Calcular los datos a mostrar filtrando por "NúmeroTelefónico" si se seleccionó
    const filteredData =
        selectedNumero !== null
            ? sortedData.filter(item => String(item.NúmeroTelefónico) === String(selectedNumero))
            : sortedData;

    const paginatedData = filteredData.slice(
        (currentTablePage - 1) * itemsPerPage,
        currentTablePage * itemsPerPage
    );

    return (
        <>
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 1050
                }}
            >
                <Toast.Header>
                    <strong className="me-auto">Notificación</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
            <Row xs={12} md={12} className="p-0">
                <Card>
                    <Card.Body>
                        <i className="h5 card-title">
                            <ClockHistory /> Gestiones
                        </i>

                        <table
                            className="table table-dark table-hover custom-scroll" // Se agregó la clase custom-scroll
                            style={{
                                maxHeight: "248px",
                                display: "block",
                                overflowY: "auto",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Fecha
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Hora
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Telefóno
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Contacto
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Situación
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Nombre
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Parentesco
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        CausaNoPago
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Modo
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Acercamiento
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Etapa
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Seguimiento
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Realizado
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Duración
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Ejecutivo
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Usuario
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Sucursal
                                    </th>
                                    <th
                                        scope="col"
                                        style={{
                                            position: "sticky",
                                            top: -10,
                                            zIndex: 15,
                                            backgroundColor: "#343a40"
                                        }}
                                    >
                                        Extensión
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="18" style={{ height: "200px" }}></td>
                                    </tr>
                                ) : (
                                    paginatedData.map((gestion, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowClick(gestion)}
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                    selectedGestion === gestion ? "#343a40" : "inherit"
                                            }}
                                        >
                                            <td>
                                                {validateField(
                                                    gestion.Fecha_Insert.replace("12:00:00 a. m.", " ")
                                                )}
                                            </td>
                                            <td>{validateField(gestion.Segundo_Insert)}</td>
                                            <td>
                                                {(() => {
                                                    const validated = validateField(gestion.NúmeroTelefónico);
                                                    return validated === "--"
                                                        ? "--"
                                                        : typeof validated === "string" && validated.length > 4
                                                            ? 'X'.repeat(validated.length - 4) + validated.slice(-4)
                                                            : validated;
                                                })()}
                                            </td>
                                            <td>{validateField(gestion.Contacto)}</td>
                                            <td>{validateField(gestion.Situación)}</td>
                                            <td>{validateField(gestion.NombreContacto)}</td>
                                            <td>{validateField(gestion.Parentesco)}</td>
                                            <td>{validateField(gestion.CausaNoPago)}</td>
                                            <td>{validateField(gestion.Modo)}</td>
                                            <td>{validateField(gestion.Acercamiento)}</td>
                                            <td>{validateField(gestion.Etapa)}</td>
                                            <td>{validateField(gestion.Seguimiento)}</td>
                                            <td>{validateField(gestion._Realizado)}</td>
                                            <td>{validateField(gestion.Duración)}</td>
                                            <td>{validateField(gestion.Ejecutivo)}</td>
                                            <td>{validateField(gestion.Usuario)}</td>
                                            <td>{validateField(gestion.Sucursal)}</td>
                                            <td>{validateField(gestion.idExtensión)}</td>
                                        </tr>
                                    ))
                                )}
                                {isLoading && (
                                    <tr>
                                        <td colSpan="18" style={{ textAlign: "center" }}>
                                            Cargando más datos...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot style={{ position: "sticky", bottom: -10, zIndex: 2, backgroundColor: "#343a40" }}>
                                <tr>
                                    <td colSpan="18">
                                        <div>
                                            <Row>
                                                <Col className="elemento">
                                                    <strong>Comentario: </strong>
                                                    {selectedGestion ? (
                                                        <span>{validateField(selectedGestion.Comentario)}</span>
                                                    ) : (
                                                        <span>Selecciona un registro.</span>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                    </Card.Body>
                </Card>
            </Row>
        </>
    );
};

export default Managments;