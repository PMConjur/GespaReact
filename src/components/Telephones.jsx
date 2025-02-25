import React, { useEffect, useState } from "react";
import { Card, Table, Button, InputGroup, FormControl } from "react-bootstrap";
import { Whatsapp, ChatDots } from "react-bootstrap-icons";
import { fetchPhones } from "../services/axiosServices"; // Importa el servicio
import { useContext } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto DEL PADRE 

const Telephones = () => {
  const [data, setData] = useState([]); // Estado para los datos de la tabla
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const [phoneNumber, setPhoneNumber] = useState(""); // Estado para el número de teléfono
  const { searchResults } = useContext(AppContext);
  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const phones = await Promise.all(
          searchResults.map(async (result, index) => {
            const phones = await fetchPhones(result.idCuenta); // Usar result.idCuenta
            return phones;
          })
        );
        setData(phones.flat()); // Actualizar el estado con los datos de la API
      } catch (error) {
        //console.error("Error al cargar los teléfonos:", error);
        toast.warning(
          "La cuenta no tiene cargado telefonos"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchResults]); // Dependencia: cuando `searchResults` cambie, se ejecuta este efecto

  // Manejar el cambio en el input del número de teléfono

  return (
    <Card className="overflow-auto bg-dark">
      <Card.Body>
        <h5 className="card-title text-white">Telefonos</h5>
        <Table hover variant="dark" className="table" responsive="sm">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="d-flex">
                  <Button
                    variant="success"
                    className="me-2"
                    style={{ width: "20%" }}
                     // Función para WhatsApp
                  >
                    <Whatsapp /> WhatsApp
                  </Button>
                  <Button
                    variant="primary"
                    className="me-2"
                    style={{ width: "25%" }}
                    // Función para Llamada de entrada
                  >
                    Llamada de entrada
                  </Button>
                  <InputGroup style={{ width: "35%" }}>
                    <FormControl
                      placeholder="_____-_____-_____"
                      value={phoneNumber}
                    // Manejar cambio en el input
                    />
                    <Button variant="secondary">
                      Validar
                    </Button>
                  </InputGroup>
                </div>
              </th>
            </tr>
          </thead>
        </Table>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}> {/* Contenedor con scroll */}
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>T</th>
                <th>C</th>
                <th>D</th>
                <th>S</th>
                <th>IntentoViciDial</th>
                <th>ID</th>
                <th>Telefono</th>
                <th>Telefonia</th>
                <th>Origen</th>
                <th>Clase</th>
                <th>Estado</th>
                <th>Municipio</th>
                <th>HusoHorario</th>
                <th>HorarioContacto</th>
                <th>Extensión</th>
                <th>Confirmado</th>
                <th>FechaActivada</th>
                <th>Calificacion</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="18" className="text-center">
                    Cargando...
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.titulares}</td>
                    <td>{row.conocidos}</td>
                    <td>{row.desconocidos}</td>
                    <td>{row.sinContacto}</td>
                    <td>{row.intentoViciDial}</td>
                    <td>{row.id}</td>
                    <td>
                      <a href="#" className="text-primary">
                        {"xxxxxx" + row.númeroTelefónico.slice(6)}
                      </a>
                    </td>
                    <td>{row.idTelefonía}</td>
                    <td>{row.idOrigen}</td>
                    <td>{row.idClase}</td>
                    <td>{row.estado}</td>
                    <td>{row.municipio}</td>
                    <td>{row.husoHorario}</td>
                    <td>{row.segHorarioContacto}</td>
                    <td>{row.extensión}</td>
                    <td>{row._Confirmado}</td>
                    <td>{row.fecha_Insert}</td>
                    <td>{row.calificacion}</td>
                    <td>{row.activo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Telephones;