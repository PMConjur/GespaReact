import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Toast } from "react-bootstrap";
import { AppContext } from "../pages/Managment"; // Importar el contexto
import { getGestionTeData } from "../services/gespawebServices"; // Importar el endpoint

const Managments = () => {
  const { searchResults } = useContext(AppContext); // Consumir el contexto
  const [sortedData, setSortedData] = useState([]); // Estado para los datos ordenados
  const [selectedGestion, setSelectedGestion] = useState(null); // Estado para el registro seleccionado
  const [showToast, setShowToast] = useState(false); // Estado para mostrar el toast
  const [toastMessage, setToastMessage] = useState(""); // Mensaje dinámico para el toast

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

        const gestionData = await getGestionTeData(1, idCuenta); // idCartera fijo como 1
        setSortedData(gestionData); // Guardar los datos obtenidos
      } catch (error) {
        console.error("Error al obtener los datos de gestión:", error);
        setToastMessage("❌ Error al obtener los datos de gestión. Intente nuevamente.");
        setShowToast(true);
      }
    };

    fetchData();
  }, [searchResults]);

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
                  {sortedData.length === 0 ? (
                    <tr>
                      <td colSpan="18" style={{ height: "200px" }}></td>
                    </tr>
                  ) : (
                    sortedData.map((gestion, index) => (
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
                </tbody>
              </table>
            </Card.Body>
            <Card.Body>
              
              <table
                className="table table-dark"
                style={{
                  maxHeight: "120px", // Ajuste de altura a 1520px
                  overflowY: "auto", // Habilitar scroll vertical dentro de la tabla
                  display: "block", // Necesario para que funcione el scroll en tablas
                }}
              >
                <thead>
                  <tr>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGestion ? (
                    <tr>
                      <td>{validateField(selectedGestion.Comentario)}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ height: "100px" }}>
                        Selecciona un registro para ver los comentarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Managments;