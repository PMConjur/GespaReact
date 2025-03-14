import { useState, useCallback, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { auto } from "@popperjs/core";
import PropTypes from 'prop-types';
import { getGestionTeData } from "../services/gespawebServices";

const Managments = ({ searchResults }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortByOldest, setSortByOldest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchResults && searchResults.length > 0) {
        const data = await getGestionTeData(searchResults);
        setSortedData(data);
      } else {
        setSortedData([]);
      }
    };
    fetchData();
  }, [searchResults]);

  const handleSortChange = useCallback(() => {
    console.log("Ordenando por fecha más antigua:", sortByOldest);
    setSortByOldest(prev => !prev);
    setSortedData(prevData =>
       !sortByOldest
         ? [...prevData].sort((a, b) => new Date(a.Fecha_Insert) - new Date(b.Fecha_Insert))
        : [...sortedData]
    );
  }, [sortByOldest, sortedData]);

  return (
    <Row xs={12} md={auto} className="g-2">
      {Array.from({ length: 1 }).map((_, idx) => (
        <Col key={idx} md={12}>
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
                        {sortedData.map((gestion, index) => (
                          <tr key={index}>
                            <td>{gestion.Fecha_Insert}</td>
                            <td>{gestion.Segundo_Insert}</td>
                            <td>{gestion.N\u00FAmeroTelef\u00F3nico}</td>
                            <td>{gestion.idContacto}</td>
                            <td>{gestion.idSituaci\u00F3n}</td>
                            <td>{gestion.NombreContacto}</td>
                            <td>{gestion.idParentesco}</td>
                            <td>{gestion.idCausaNoPago}</td>
                            <td>{gestion.idModo}</td>
                            <td>{gestion.idAcercamiento}</td>
                            <td>{gestion.idEtapa}</td>
                            <td>{gestion.Seguimiento}</td>
                            <td>{gestion._Realizado}</td>
                            <td>{gestion.Duraci\u00F3n}</td>
                            <td>{gestion.Ejecutivo}</td>
                            <td>{gestion.Usuario}</td>
                            <td>{gestion.idSucursal}</td>
                            <td>{gestion.Extensi\u00F3n}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

Managments.propTypes = {
  searchResults: PropTypes.array.isRequired,
};

export default Managments;
