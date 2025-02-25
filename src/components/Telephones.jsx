import React, { useEffect, useState } from "react";
import { Card, Table, Button, InputGroup, FormControl } from "react-bootstrap";
import { Whatsapp, ChatDots } from "react-bootstrap-icons";
import { fetchPhones } from "../services/axiosServices"; // Importa el servicio

const Telephones = ({
  idCuenta,               // ID de la cuenta para buscar los teléfonos
  onWhatsAppClick,        // Función para el botón de WhatsApp
  onCallClick,            // Función para el botón de Llamada de entrada
  onValidateClick,        // Función para el botón de Validar
}) => {
  const [data, setData] = useState([]); // Estado para los datos de la tabla
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const [phoneNumber, setPhoneNumber] = useState(""); // Estado para el número de teléfono

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const phones = await fetchPhones(idCuenta); // Usar el servicio para obtener los datos
        setData(phones); // Actualizar el estado con los datos de la API
      } catch (error) {
        console.error("Error al cargar los teléfonos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [idCuenta]); // Dependencia: cuando `idCuenta` cambie, se ejecuta este efecto

  // Manejar el cambio en el input del número de teléfono
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Manejar la validación del número de teléfono
  const handleValidate = () => {
    if (onValidateClick) {
      onValidateClick(phoneNumber); // Pasar el número de teléfono a la función de validación
    }
  };

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
                    onClick={onWhatsAppClick} // Función para WhatsApp
                  >
                    <Whatsapp /> WhatsApp
                  </Button>
                  <Button
                    variant="primary"
                    className="me-2"
                    style={{ width: "25%" }}
                    onClick={onCallClick} // Función para Llamada de entrada
                  >
                    Llamada de entrada
                  </Button>
                  <InputGroup style={{ width: "35%" }}>
                    <FormControl
                      placeholder="_____-_____-_____"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange} // Manejar cambio en el input
                    />
                    <Button variant="secondary" onClick={handleValidate}>
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
                        {row.númeroTelefónico}
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