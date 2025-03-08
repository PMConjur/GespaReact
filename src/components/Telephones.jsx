import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Table,
  Button,
  InputGroup,
  FormControl,
  Placeholder,
  DropdownButton,
  Dropdown
} from "react-bootstrap";
import { fetchPhones, fetchValidationTel, fetchNewTel } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";
import "../scss/styles.scss";
import { TelephoneFill } from "react-bootstrap-icons";

const Telephones = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNew, setIsPhoneNew] = useState(false); // Estado para manejar si el teléfono es nuevo
  const { searchResults, setSelectedAnswer } = useContext(AppContext);
  const [toastShown, setToastShown] = useState(false);
  const [selectedClaseTelefono, setSelectedClaseTelefono] = useState("");

  const loadData = async () => {
    console.log("searchResults:", searchResults);
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

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 13) {
      setPhoneNumber(input);
    }
  };

  const handleValidatePhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Ingrese un número de teléfono", { position: "top-right",
        style: { transform: "translateY(80vh)" }
       });
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 13) {
      toast.warning("El número de teléfono debe tener 10 o 11 dígitos", {
        position: "top-right"
      });
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("No hay una cuenta válida seleccionada", {
        position: "top-right"
      });
      return;
    }

    const idCuenta = searchResults[0].idCuenta;

    try {
      const response = await fetchValidationTel({
        telefono: phoneNumber,
        idCuenta
      });

      if (response.exists) {
        toast.success("El número de teléfono existe en la cuenta", {
          position: "top-right",
          style: { transform: "translateY(80vh)" }
        });
        setIsPhoneNew(false); // El teléfono existe, no es nuevo
      } else {
        toast.error("El número de telefono no existe en la cuenta", {
          position: "center-right",
          style: { transform: "translateY(80vh)" }
        });
        setIsPhoneNew(true); // El teléfono no existe, es nuevo
      }
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      toast.error("El número de teléfono no existe en la cuenta", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      setIsPhoneNew(true); // En caso de error, considerar el teléfono como nuevo
    }
  };

  const handleSaveNewPhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Ingrese un número de teléfono", { position: "top-right", 
        style: { transform: "translateY(80vh)" }
       }
        
      );
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 13) {
      toast.warning("El número de teléfono debe tener 10 o 11 dígitos", {
        position: "top-right"
      });
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("No hay una cuenta válida seleccionada", {
        position: "top-right"
      });
      return;
    }

    const idCuenta = searchResults[0].idCuenta;
    const idEjecutivo = searchResults[0].idEjecutivo; // Asegúrate de obtener el idEjecutivo correcto

    const newPhoneData = {
      cuenta: idCuenta,
      idEjecutivo: idEjecutivo,
      phoneNumber: phoneNumber,
      telefonia: "fija", // Ajusta estos valores según sea necesario
      claseTelefono: selectedClaseTelefono,
      horarioContacto: "05:53:10",
      extension: 0
    };

    try {
      const response = await fetchNewTel(newPhoneData);
      toast.success("Nuevo número de teléfono guardado", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      setIsPhoneNew(false); // Restablecer el estado del teléfono nuevo
      setPhoneNumber(""); // Limpiar el campo de entrada
      loadData(); // Recargar los datos de los teléfonos
    } catch (error) {
      console.error("Error al guardar el nuevo teléfono:", error);
      toast.error("Error al guardar el nuevo teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      loadData();
    }
  }, [searchResults]);

  return (
    <Card className="overflow-auto card-phones">
      <Card.Body className="card-body-phones">
        <h5 className="card-title text-white">
          <TelephoneFill /> Teléfonos
        </h5>
        <Table hover variant="dark" className="table " responsive="sm">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="button-phones">
                  <Button
                    variant="primary"
                    className="me-2 input-phone"
                    style={{ width: "25%" }}
                    onClick={() => {
                      setSelectedAnswer(10); // Enviar valor 10 al Form.Check en Flow.jsx
                    }}
                  >
                    Llamada de entrada
                  </Button>
                  {isPhoneNew && (
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={selectedClaseTelefono || "Clase de telefono"}
                      onSelect={(e) => setSelectedClaseTelefono(e)}
                      className="custom-dropdown-menu"
                    >
                      <Dropdown.Item eventKey="Hogar">Hogar</Dropdown.Item>
                      <Dropdown.Item eventKey="Tercero">Tercero</Dropdown.Item>
                      <Dropdown.Item eventKey="Familiar">Familiar</Dropdown.Item>
                      <Dropdown.Item eventKey="Empresa Trabajo">Empresa Trabajo</Dropdown.Item>
                      <Dropdown.Item eventKey="Celular">Celular</Dropdown.Item>
                      <Dropdown.Item eventKey="Recados">Recados</Dropdown.Item>
                      <Dropdown.Item eventKey="Oficina">Oficina</Dropdown.Item>
                      <Dropdown.Item eventKey="Baja">Baja</Dropdown.Item>
                    </DropdownButton>
                  )}
                  <InputGroup style={{ width: "35%" }} className="input-phone">
                    <FormControl
                      placeholder="Numero de telefono"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="input-validation"
                    />
                    <Button
                      variant="secondary"
                      onClick={isPhoneNew ? handleSaveNewPhone : handleValidatePhone}
                    >
                      {isPhoneNew ? "Nuevo" : "Validar"}
                    </Button>
                  </InputGroup>
                </div>
              </th>
            </tr>
          </thead>
        </Table>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table striped bordered hover variant="dark" className="">
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
              {isLoading
                ? [...Array(4)].map((_, i) => (
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
                : data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.titulares || "--"}</td>
                      <td>{row.conocidos || "--"}</td>
                      <td>{row.desconocidos || "--"}</td>
                      <td>{row.sinContacto || "--"}</td>
                      <td>{row.intentosViciDial || "--"}</td>
                      <td>{row.id || "--"}</td>
                      <td>
                        <a
                          href="#"
                          className="text-primary"
                          onClick={() => setSelectedAnswer(2)}
                        >
                          {"XXXXXX" + row.númeroTelefónico.slice(6)}
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
                      <td>
                        {new Date(row.fecha_Insert).toLocaleDateString() ||
                          "--"}
                      </td>
                      <td>{row.calificacion || "--"}</td>
                      <td>{row.activo ? "Activo" : "Inactivo" || "--"}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Telephones;