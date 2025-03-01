import React, { useEffect, useState } from "react";
import { Card, Table, Button, InputGroup, FormControl, Placeholder } from "react-bootstrap";
import { fetchPhones, fetchValidationTel } from "../services/gespawebServices";
import { useContext } from "react";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";
import "../scss/styles.scss";

const Telephones = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { searchResults } = useContext(AppContext);
  const [toastShown, setToastShown] = useState(false);

  // Cargar datos desde la API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const phones = await Promise.all(
        searchResults.map(async (result) => {
          return await fetchPhones(result.idCuenta);
        })
      );
      const flatPhones = phones.flat();
      setData(flatPhones);
      if (flatPhones.length === 0 && !toastShown) {
        toast.error("No hay carga de teléfonos", { position: "top-right" });
        setToastShown(true);
      }
    } catch (error) {
      console.error("Error al cargar los teléfonos:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Manejo del input de teléfono
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
    if (input.length <= 11) {
      setPhoneNumber(input);
    }
  };

  // Validar número de teléfono
  const handleValidatePhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Ingrese un número de teléfono", { position: "top-right" });
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 11) {
      toast.warning("El número de teléfono debe tener 10 dígitos", { position: "top-right" });
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("No hay una cuenta válida seleccionada", { position: "top-right" });
      return;
    }
  
    const idCuenta = searchResults[0].idCuenta; 
  
    try {
      const response = await fetchValidationTel({ telefono: phoneNumber, idCuenta });
  
      if (response.exists) {
        toast.success("El número de teléfono existe en la cuenta", {
          position: "top-right",
          style: { transform: "translateY(20vh)" }, // Ajusta verticalmente
        });
      } else {
        toast.error("El número de telefono no existe en la cuenta", { position: "center-right"});
      }
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      toast.error("El número de teléfono no existe en la cuenta", {
        position: "top-right",
        style: { transform: "translateY(20vh)" }, // Ajusta verticalmente
      });
    }
  };  

  // Buscar datos cuando haya cambios en searchResults
  useEffect(() => {
    if (searchResults.length > 0) {
      loadData();
    }
  }, [searchResults]);

  return (
    <Card className="overflow-auto card-phones">
      <Card.Body>
        <h5 className="card-title text-white">Teléfonos</h5>
        <Table hover variant="dark" className="table" responsive="sm">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="button-phones">
                  <Button variant="primary" className="me-2 input-phone" style={{ width: "25%" }} onClick={loadData}>
                    Llamada de entrada
                  </Button>
                  <InputGroup style={{ width: "35%" }} className="input-phone">
                    <FormControl
                      placeholder="Numero de telefono"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="input-validation"
                    />
                    <Button variant="secondary" onClick={handleValidatePhone}>
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
                <th>Teléfono</th>
                <th>Telefonía</th>
                <th>Origen</th>
                <th>Clase</th>
                <th>Estado</th>
                <th>Municipio</th>
                <th>Huso Horario</th>
                <th>SEG Horario Contacto</th>
                <th>Extensión</th>
                <th>Confirmado</th>
                <th>Fecha INSERT</th>
                <th>Calificación</th>
                <th>Activo</th>
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
                    <td>{row.titulares || "--"}</td>
                    <td>{row.conocidos || "--"}</td>
                    <td>{row.desconocidos || "--"}</td>
                    <td>{row.sinContacto || "--"}</td>
                    <td>{row.intentosViciDial || "--"}</td>
                    <td>{row.id || "--"}</td>
                    <td>
                      <a>
                        {"XXXXXX" + row.númeroTelefónico.slice(6) || "--"}
                      </a>
                    </td>
                    <td>{row.idTelefonía || "--"}</td>
                    <td>{row.idOrigen || "--"}</td>
                    <td>{row.idClase || "--"}</td>
                    <td>{row.estado || "--"}</td>
                    <td>{row.municipio || "--"}</td>
                    <td>{row.husoHorario || "--"}</td>
                    <td>{row.segHorarioContacto || "--"}</td>
                    <td>{row.extensión || "--"}</td>
                    <td>{row._Confirmado ? "Sí" : "No" || "--"}</td>
                    <td>{new Date(row.fecha_Insert).toLocaleDateString() || "--"}</td>
                    <td>{row.calificacion || "--"}</td>
                    <td>{row.activo ? "Activo" : "Inactivo" || "--"}</td>
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
