import { useEffect, useState } from "react";
import { Row, Col, Card, Toast } from "react-bootstrap";
import { getGestionTeData } from "../services/gespawebServices";

const Managments = () => {
  const [sortedData, setSortedData] = useState([]);
  const [showToast, setShowToast] = useState(false); // Estado para manejar la visibilidad del toast
  const searchResults = []; // Asegúrate de que searchResults contenga los datos necesarios.

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validar que searchResults tenga al menos un elemento con idCuenta
        if (searchResults.length === 0 || !searchResults[0]?.idCuenta) {
          console.warn("⚠️ No se encontró un idCuenta válido en searchResults.");
          setShowToast(true); // Mostrar el toast
          return;
        }

        const idCuenta = searchResults[0].idCuenta; // Obtener idCuenta del primer elemento válido
        const idCartera = 1; // idCartera siempre es 1.

        console.log("🔍 Enviando idCuenta e idCartera a getGestionTeData:", { idCuenta, idCartera });

        const data = await getGestionTeData({ idCuenta, idCartera });
        setSortedData(data);
      } catch (error) {
        console.error("Error fetching gestion data:", error);
      }
    };

    fetchData();
  }, []);

  const validateField = (field) => (field === null || field === undefined || field === "" ? "--" : field);

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
        <Toast.Body>⚠️ No se encontró un idCuenta válido en los resultados de búsqueda.</Toast.Body>
      </Toast>
      <Row xs={12} md="auto" className="g-2">
        <Col md={12}>
          <Card>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="col-12">
                <div className="card recent-sales overflow-auto scroller">
                  <div className="card-body">
                    <h5 className="card-title">Gestiones</h5>
                    <table className="table table-dark">
                      <thead>
                        <tr>
                          <th scope="col">Fecha</th>
                          <th scope="col">Hora</th>
                          <th scope="col">Telefono</th>
                          <th scope="col">Contacto</th>
                          <th scope="col">Situación</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Parentesco</th>
                          <th scope="col">CausaNoPago</th>
                          <th scope="col">Modo</th>
                          <th scope="col">Acercamiento</th>
                          <th scope="col">Etapa</th>
                          <th scope="col">Seguimiento</th>
                          <th scope="col">Realizado</th>
                          <th scope="col">Duración</th>
                          <th scope="col">Ejecutivo</th>
                          <th scope="col">Usuario</th>
                          <th scope="col">Sucursal</th>
                          <th scope="col">Extensión</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.length === 0 ? (
                          <tr>
                            <td colSpan="18" style={{ height: "200px" }}></td>
                          </tr>
                        ) : (
                          sortedData.map((gestion, index) => (
                            <tr key={index}>
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
                              <td>{validateField(gestion.Extensión)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <Card.Body>
              <Card.Title>Comentarios</Card.Title>
              <table className="table table-dark">
                <thead></thead>
                <tbody>
                  {sortedData.length === 0 ? (
                    <tr>
                      <td style={{ height: "100px" }}></td>
                    </tr>
                  ) : (
                    sortedData.map((gestion, index) => (
                      <tr key={index}>
                        <td>{validateField(gestion.Comentario)}</td>
                        <td>{validateField(gestion.BaseDatos)}</td>
                      </tr>
                    ))
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