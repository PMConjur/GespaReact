import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Toast, Pagination } from "react-bootstrap";
import { AppContext } from "../pages/Managment"; // Importar el contexto
import { getGestionTeData } from "../services/gespawebServices"; // Importar el endpoint
import { ClockHistory } from "react-bootstrap-icons";
import { toast } from "sonner"; // Importar la librería sonner

const Managments = () => {
  const { searchResults, selectedPhoneFilter, refreshManagments, setRefreshManagments } = useContext(AppContext); // Agregar refreshManagments del contexto
  const [sortedData, setSortedData] = useState([]); // Estado para los datos ordenados
  const [selectedGestion, setSelectedGestion] = useState(null); // Estado para el registro seleccionado
  const [showToast, setShowToast] = useState(false); // Estado para mostrar el toast
  const [toastMessage, setToastMessage] = useState(""); // Mensaje dinámico para el toast
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la carga perezosa
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está cargando más data
  const [itemsPerPage] = useState(100); // Número de registros por página
  const [currentTablePage, setCurrentTablePage] = useState(1); // Página actual de la tabla
  const [paginationGroup, setPaginationGroup] = useState(0); // Grupo actual de 10 páginas
  const [totalResults, setTotalResults] = useState(10000); // Total de resultados requeridos (puede ser dinámico)

  // Función para calcular el número total de páginas basado en los resultados obtenidos
  const calculateTotalPages = (dataLength, itemsPerPage) => {
    return Math.ceil(dataLength / itemsPerPage);
  };

  // Función para procesar y normalizar los datos
  const processAndNormalizeData = (data) => {
    return data.map((item) => {
      let fechaInsert;

      if (typeof item.Fecha_Insert === "string") {
        const dateStr = item.Fecha_Insert.replace("12:00:00 a. m.", "").trim();
        const [day, month, year] = dateStr.split("/");

        // Convertir a formato MM/DD/AAAA para ordenamiento
        fechaInsert = new Date(`${month}/${day}/${year}`);
        if (isNaN(fechaInsert.getTime())) {
          fechaInsert = new Date(0); // Fecha mínima si no es válida
        }
      } else if (item.Fecha_Insert instanceof Date) {
        fechaInsert = item.Fecha_Insert;
      } else {
        fechaInsert = new Date(0);
      }

      // Usar directamente Segundo_Insert como Hora_Insert
      const horaInsert = item.Segundo_Insert || "--";

      return {
        ...item,
        Fecha_Insert: fechaInsert,
        Hora_Insert: horaInsert, // Asignar directamente el valor de Segundo_Insert
        fullTimestamp: `${fechaInsert.getTime()}_${horaInsert}`, // Combinar fecha y hora para ordenamiento
      };
    });
  };

  // Hook para obtener y procesar datos
  useEffect(() => {
    const fetchAndProcessData = async () => {
      if (!searchResults || searchResults.length === 0) {
        setSortedData([]);
        setTotalResults(0);
        setSelectedGestion(null);
        return;
      }

      try {
        const idCartera = searchResults[0]?.idCartera;
        const idCuenta = searchResults[0]?.idCuenta;

        if (!idCartera || !idCuenta) {
          console.error("Error: idCartera o idCuenta no son válidos.");
          return;
        }

        const gestionData = await getGestionTeData(idCartera, idCuenta);
        const processedData = processAndNormalizeData(gestionData);

        // Ordenar por fecha y hora (fullTimestamp)
        processedData.sort((a, b) => {
          const [timeA, hourA] = a.fullTimestamp.split("_");
          const [timeB, hourB] = b.fullTimestamp.split("_");
          return timeB - timeA || hourB.localeCompare(hourA);
        });

        setSortedData(processedData);
        setTotalResults(processedData.length);
      } catch (error) {
        console.error("Error al obtener los datos de gestión:", error);
        toast.error("Error al cargar los datos de gestión.");
      }
    };

    fetchAndProcessData();
  }, [searchResults]);

  // Hook para manejar actualizaciones automáticas al detectar cambios en refreshManagments
  useEffect(() => {
    if (refreshManagments) {
      const fetchAndUpdateData = async () => {
        try {
          const idCartera = searchResults[0]?.idCartera;
          const idCuenta = searchResults[0]?.idCuenta;

          if (!idCartera || !idCuenta) {
            console.error("Error: idCartera o idCuenta no son válidos.");
            return;
          }

          const gestionData = await getGestionTeData(idCartera, idCuenta);
          const processedData = processAndNormalizeData(gestionData);

          // Ordenar por fecha y hora (fullTimestamp)
          processedData.sort((a, b) => {
            const [timeA, hourA] = a.fullTimestamp.split("_");
            const [timeB, hourB] = b.fullTimestamp.split("_");
            return timeB - timeA || hourB.localeCompare(hourA);
          });

          setSortedData(processedData);
          setTotalResults(processedData.length);
          setRefreshManagments(false); // Reiniciar el estado después de actualizar
        } catch (error) {
          console.error("Error al actualizar los datos de gestión:", error);
          toast.error("Error al actualizar los datos de gestión.");
        }
      };

      fetchAndUpdateData();
    }
  }, [refreshManagments, searchResults]); // Escuchar cambios en refreshManagments y searchResults

  // Hook para manejar filtrado por ícono Eye
  useEffect(() => {
    const fetchFilteredData = async () => {
      if (selectedPhoneFilter) {
        try {
          setIsLoading(true);
          const filteredData = sortedData.filter(
            (gestion) => gestion.NúmeroTelefónico === selectedPhoneFilter
          );

          // Ordenar los datos filtrados por fullTimestamp
          filteredData.sort((a, b) => {
            const [timeA, hourA] = a.fullTimestamp.split("_");
            const [timeB, hourB] = b.fullTimestamp.split("_");
            return timeB - timeA || hourB.localeCompare(hourA);
          });

          setSortedData(filteredData); // Actualizar los datos filtrados
          setIsLoading(false);
        } catch (error) {
          console.error("Error al filtrar los datos:", error);
          toast.error("Error al filtrar los datos.");
          setIsLoading(false);
        }
      } else {
        // Si no hay filtro, restaurar los datos originales
        try {
          setIsLoading(true);
          const idCartera = searchResults[0]?.idCartera;
          const idCuenta = searchResults[0]?.idCuenta;

          if (!idCartera || !idCuenta) {
            console.error("Error: idCartera o idCuenta no son válidos.");
            return;
          }

          const gestionData = await getGestionTeData(idCartera, idCuenta);
          const processedData = processAndNormalizeData(gestionData);

          // Ordenar por fecha y hora (fullTimestamp)
          processedData.sort((a, b) => {
            const [timeA, hourA] = a.fullTimestamp.split("_");
            const [timeB, hourB] = b.fullTimestamp.split("_");
            return timeB - timeA || hourB.localeCompare(hourA);
          });

          setSortedData(processedData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error al restaurar los datos:", error);
          setIsLoading(false);
        }
      }
    };

    fetchFilteredData();
  }, [selectedPhoneFilter, searchResults]); // Dependencias para ejecutar el filtro

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

  // Función para formatear la fecha a DD/MM/AAAA
  const formatDateToDDMMYYYY = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "--";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Manejar la selección de un registro
  const handleRowClick = (gestion) => {
    setSelectedGestion(gestion); // Establecer el registro seleccionado
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
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentTablePage(pageNumber);

      // Actualizar el grupo si la página seleccionada está fuera del grupo actual
      const newGroup = Math.floor((pageNumber - 1) / pagesPerGroup);
      if (newGroup !== paginationGroup) {
        setPaginationGroup(newGroup);
      }

      // Cargar los datos de la página seleccionada
      // try {
      //   setIsLoading(true);
      //   const idCuenta = searchResults[0]?.idCuenta;
      //   const pageData = await getGestionTeData(pageNumber, idCuenta);
      //   setSortedData(pageData); // Reemplazar los datos en lugar de concatenarlos
      //   setIsLoading(false);
      // } catch (error) {
      //   console.error("Error al cargar los datos de la página:", error);
      //   setIsLoading(false);
      // }
    }
  };

  // Calcular los datos a mostrar en la página actual
  const paginatedData = sortedData.slice(
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
      <Row xs={12} md="auto">
        <Col md={12}>
          <Card>
            <Card.Body>
              <i className="h5 card-title">
                <ClockHistory /> Gestiones
              </i>

              <table
                className="table table-dark table-hover"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  display: "block"
                }}
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        position: "sticky",
                        top: -10,
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
                        backgroundColor: "#343a40"
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                        zIndex: 2,
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
                            formatDateToDDMMYYYY(gestion.Fecha_Insert) // Formatear a DD/MM/AAAA
                          )}
                        </td>
                        <td>{validateField(gestion.Hora_Insert)}</td> {/* Mostrar hora en formato HH:MM:SS */}
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
              </table>
            </Card.Body>
            <Card.Footer>
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
                <Row>
                  <Col className="box">
                    <Pagination variant="dark">
                      <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentTablePage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentTablePage - 1)}
                        disabled={currentTablePage === 1}
                      />
                      {paginationGroup > 0 && (
                        <Pagination.Ellipsis
                          onClick={handlePrevGroup}
                          title="Páginas anteriores"
                        />
                      )}
                      {visiblePages.map((page) => (
                        <Pagination.Item
                          key={page}
                          active={page === currentTablePage}
                          onClick={() => handlePageChange(page)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: page === currentTablePage ? "#343a40" : "inherit",
                            color: page === currentTablePage ? "white" : "inherit",
                          }}
                          onMouseEnter={(e) => {
                            if (page !== currentTablePage) e.target.style.backgroundColor = "#495057";
                          }}
                          onMouseLeave={(e) => {
                            if (page !== currentTablePage) e.target.style.backgroundColor = "inherit";
                          }}
                        >
                          {page}
                        </Pagination.Item>
                      ))}
                      {(paginationGroup + 1) * pagesPerGroup < totalPages && (
                        <Pagination.Ellipsis
                          onClick={handleNextGroup}
                          title="Siguientes páginas"
                        />
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
                  </Col>
                </Row>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Managments;