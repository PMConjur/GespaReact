import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Toast, Pagination } from "react-bootstrap";
import { AppContext } from "../pages/Managment"; // Importar el contexto
import { getGestionTeData } from "../services/gespawebServices"; // Importar el endpoint

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

  // Hook para obtener los datos
  useEffect(() => {
    const fetchData = async () => {
      if (!searchResults || searchResults.length === 0) {
        setToastMessage("Error 428: Primero debes buscar una Cuenta.");
        setShowToast(true);
        return;
      }

      try {
        const idCuenta = searchResults[0]?.idCuenta; // Obtener el primer idCuenta como ejemplo
        if (!idCuenta) {
          setToastMessage("No se encontró un idCuenta válido.");
          setShowToast(true);
          return;
        }

        setIsLoading(true); // Iniciar carga
        const gestionData = await getGestionTeData(currentPage, idCuenta); // Usar currentPage para la paginación
        setSortedData((prevData) => [...prevData, ...gestionData]); // Agregar nuevos datos a los existentes
        setIsLoading(false); // Finalizar carga
      } catch (error) {
        console.error("Error al obtener los datos de gestión:", error);
        setToastMessage("❌ Error al obtener los datos de gestión. Intente nuevamente.");
        setShowToast(true);
        setIsLoading(false); // Finalizar carga en caso de error
      }
    };

    fetchData();
  }, [searchResults, currentPage]);

  // Validar campos para evitar errores al renderizar
  const validateField = (field) => {
    if (field === null || field === undefined || field === "") {
      return "--";
    }
    if (typeof field === "object") {
      return JSON.stringify(field); // Convertir objetos a string
    }
    return field;
  };

  // Manejar la selección de un registro
  const handleRowClick = (gestion) => {
    setSelectedGestion(gestion); // Establecer el registro seleccionado
  };

  // Manejar el cambio de página
  const handlePageChange = async (pageNumber) => {
    if (pageNumber > 0) {
      setCurrentTablePage(pageNumber);

      try {
        setIsLoading(true); // Iniciar carga
        const idCuenta = searchResults[0]?.idCuenta; // Obtener el idCuenta actual
        const gestionData = await getGestionTeData(pageNumber, idCuenta); // Solicitar datos para la página seleccionada
        setSortedData(gestionData); // Actualizar los datos con los nuevos elementos
        setIsLoading(false); // Finalizar carga
      } catch (error) {
        console.error("Error al obtener los datos de la página:", error);
        setToastMessage("❌ Error al obtener los datos de la página. Intente nuevamente.");
        setShowToast(true);
        setIsLoading(false); // Finalizar carga en caso de error
      }
    }
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(10530 / itemsPerPage); // Cambiar 10530 por el total dinámico de la DB

  // Calcular los datos a mostrar en la página actual
  const paginatedData = sortedData.slice(
    (currentTablePage - 1) * itemsPerPage,
    currentTablePage * itemsPerPage
  );

  // Calcular las páginas visibles en el grupo actual
  const visiblePages = Array.from(
    { length: Math.min(10, totalPages - paginationGroup * 10) },
    (_, index) => paginationGroup * 10 + index + 1
  );

  // Manejar el cambio de grupo de páginas
  const handleNextGroup = () => {
    if ((paginationGroup + 1) * 10 < totalPages) {
      setPaginationGroup(paginationGroup + 1);
    }
  };

  const handlePrevGroup = () => {
    if (paginationGroup > 0) {
      setPaginationGroup(paginationGroup - 1);
    }
  };

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
          zIndex: 1050,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Notificación</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      <Row xs={12} md="auto" className="g-2">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Gestiones</Card.Title>
              <table
                className="table table-dark"
                style={{
                  maxHeight: "300px", // Ajuste de altura a 300px
                  overflowY: "auto", // Habilitar scroll vertical dentro de la tabla
                  display: "block", // Necesario para que funcione el scroll en tablas
                }}
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        position: "sticky", // Fijar posición
                        top: -10, // Mantener en la parte superior
                        zIndex: 2, // Asegurar que esté por encima del contenido
                        backgroundColor: "#343a40", // Fondo para que no se mezcle con el contenido
                      }}
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Hora
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Telefono
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Contacto
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Situación
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Parentesco
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      CausaNoPago
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Modo
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Acercamiento
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Etapa
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Seguimiento
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Realizado
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Duración
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Ejecutivo
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Usuario
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
                      }}
                    >
                      Sucursal
                    </th>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
                        backgroundColor: "#343a40",
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
                        onClick={() => handleRowClick(gestion)} // Manejar clic en la fila
                        style={{
                          cursor: "pointer",
                          backgroundColor: selectedGestion === gestion ? "#343a40" : "inherit", // Resaltar la fila seleccionada
                        }}
                      >
                        <td>{validateField(gestion.Fecha_Insert)}</td>
                        <td>{validateField(gestion.Segundo_Insert)}</td>
                        <td>{validateField(gestion.NúmeroTelefónico)}</td>
                        <td>{validateField(gestion.idContacto)}</td>
                        <td>{validateField(gestion.idSituación)}</td>
                        <td>{validateField(gestion.NombreContacto)}</td>
                        <td>{validateField(gestion.idParentesco)}</td>
                        <td>{validateField(gestion.idCausaNoPago)}</td>
                        <td>{validateField(gestion.idModo)}</td>
                        <td>{validateField(gestion.idAcercamiento)}</td>
                        <td>{validateField(gestion.idEtapa)}</td>
                        <td>{validateField(gestion.Seguimiento)}</td>
                        <td>{validateField(gestion._Realizado)}</td>
                        <td>{validateField(gestion.Duración)}</td>
                        <td>{validateField(gestion.Ejecutivo)}</td>
                        <td>{validateField(gestion.Usuario)}</td>
                        <td>{validateField(gestion.idSucursal)}</td>
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
              </table>
            </Card.Body>
            <Card.Body>
              <div style={{ display: "flex", justifyContent: "", marginBottom: "16px" }}>
                <div style={{ width: "40%", display: "flex", justifyContent: "", alignItems: "center", marginRight: "16px" }}>
                  <strong style={{ marginRight: "8px" }}>Comentario:</strong>
                  {selectedGestion ? (
                    <span>{validateField(selectedGestion.Comentario)}</span>
                  ) : (
                    <span>Selecciona un registro.</span>
                  )}
                </div>
                <Pagination variant="dark">
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentTablePage === 1} />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentTablePage - 1)}
                    disabled={currentTablePage === 1}
                  />
                  {paginationGroup > 0 && (
                    <Pagination.Ellipsis onClick={handlePrevGroup} title="Páginas anteriores" />
                  )}
                  {visiblePages.map((page) => (
                    <Pagination.Item
                      key={page}
                      active={page === currentTablePage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  {(paginationGroup + 1) * 10 < totalPages && (
                    <Pagination.Ellipsis onClick={handleNextGroup} title="Siguientes páginas" />
                  )}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentTablePage + 1)}
                    disabled={currentTablePage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentTablePage === totalPages}
                  />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Managments;