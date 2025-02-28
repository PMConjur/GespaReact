import React, { useEffect, useState } from "react";
import { Card, Table, Button, InputGroup, FormControl, Spinner, Placeholder } from "react-bootstrap"; // Importar Spinner y Placeholder
import { fetchPhones, fetchValidationTel } from "../services/gespawebServices"; // Importa el servicio
import { useContext } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto DEL PADRE 
import { toast, Toaster } from "sonner";
import "../scss/styles.scss"

const Telephones = () => {
  const [data, setData] = useState([]); // Estado para los datos de la tabla
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const [phoneNumber, setPhoneNumber] = useState(""); // Estado para el número de teléfono
  const { searchResults } = useContext(AppContext);
  const [toastShown, setToastShown] = useState(false); // Estado para controlar si el toast ya se mostró

  // Función para cargar datos desde la API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const phones = await Promise.all(
        searchResults.map(async (result, index) => {
          const phones = await fetchPhones(result.idCuenta); // Usar result.idCuenta
          return phones;
        })
      );
      const flatPhones = phones.flat();
      setData(flatPhones); // Actualizar el estado con los datos de la API
      if (flatPhones.length === 0 && !toastShown) {
        toast.error("No hay carga de telefonos", {
          position: "top-right" // Mostrar toast en el lado derecho
        });
        setToastShown(true); // Marcar que el toast ya se mostró
      }
    } catch (error) {
      console.error("Error al cargar los teléfonos:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Tiempo de carga simulado
    }
  };

  // Manejar el cambio en el input del número de teléfono
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Función para manejar la búsqueda o la acción del botón
  const handleSearch = () => {
    setToastShown(false); // Resetear el estado del toast
    loadData(); // Cargar los datos
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      loadData();
    }
  }, [searchResults]);

  return (
    <Card className="overflow-auto card-phones">
      <Card.Body>
        <h5 className="card-title text-white">Telefonos</h5>
        <Table hover variant="dark" className="table" responsive="sm">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="button-phones">
                  <Button
                    variant="primary"
                    className="me-2 input-phone"
                    style={{ width: "25%" }}
                    onClick={handleSearch} // Llamar a handleSearch al hacer clic
                  >
                    Llamada de entrada
                  </Button>
                  <InputGroup style={{ width: "35%" }} className="input-phone">
                    <FormControl
                      placeholder="_____-_____-_____"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange} // Manejar cambio en el input
                      className=" input-validation"
                    />
                    <Button variant="secondary" onClick={''}>
                      Validar
                    </Button>
                  </InputGroup>
                </div>
              </th>
            </tr>
          </thead>
        </Table>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
                <th>SEGHorarioContacto</th>
                <th>Extensión</th>
                <th>Confirmado</th>
                <th>Fecha_INSERT</th>
                <th>Calificacion</th>
                <th>ACTIVO</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(18)].map((_, j) => (
                      <td key={j}>
                        <Placeholder as="span" animation="glow">
                          <Placeholder xs={12} />
                        </Placeholder>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.titulares || '--'}</td>
                    <td>{row.conocidos || '--'}</td>
                    <td>{row.desconocidos || '--'}</td>
                    <td>{row.sinContacto || '--'}</td>
                    <td>{row.intentosViciDial || '--'}</td>
                    <td>{row.id || '--'}</td>
                    <td>
                      <a href="#" className="text-primary">
                        {"xxxxxx" + row.númeroTelefónico.slice(6) || '--'}
                      </a>
                    </td>
                    <td>{row.idTelefonía || '--'}</td>
                    <td>{row.idOrigen || '--'}</td>
                    <td>{row.idClase || '--'}</td>
                    <td>{row.estado || '--'}</td>
                    <td>{row.municipio || '--'}</td>
                    <td>{row.husoHorario || '--'}</td>
                    <td>{row.segHorarioContacto || '--'}</td>
                    <td>{row.extensión || '--'}</td>
                    <td>{row._Confirmado ? "Sí" : "No" || '--'}</td>
                    <td>{new Date(row.fecha_Insert).toLocaleDateString() || '--'}</td>
                    <td>{row.calificacion || '--'}</td>
                    <td>{row.activo ? "Activo" : "Inactivo" || '--'}</td>
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