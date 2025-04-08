import { useEffect, useState, useContext } from "react";
import {
  Card,
  Table,
  Button,
  InputGroup,
  FormControl,
  Placeholder,
  DropdownButton,
  Dropdown,
  Row,
  Col
} from "react-bootstrap";
import {
  fetchPhones,
  fetchValidationTel,
  fetchNewTel,
  validateTimeZone
} from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";
import "../scss/styles.scss";
import { TelephoneFill } from "react-bootstrap-icons";

const Telephones = () => {
  const { userActiveFlow, setSelectedAnswer } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNew, setIsPhoneNew] = useState(false);
  const { searchResults, lastPhoneNumberFromToast } = useContext(AppContext);

  const [toastShown, setToastShown] = useState(false);
  const [selectedClaseTelefono, setSelectedClaseTelefono] = useState("");
  const [horarioContacto, setHorarioContacto] = useState("00:00:00");
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 13) {
      setPhoneNumber(input);
    }
  };
  //const token = responseData?.ejecutivo?.token;

  const handleValidatePhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Ingrese un número de teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 13) {
      toast.warning(
        "Error 400: El número de teléfono debe tener 10 o 11 dígitos",
        {
          position: "top-right"
        }
      );
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("Error 404: No hay una cuenta válida seleccionada", {
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
        toast.success(" El número de teléfono existe en la cuenta", {
          position: "top-right",
          style: { transform: "translateY(80vh)" }
        });
        setIsPhoneNew(false); // El teléfono existe, no es nuevo
      } else {
        toast.error("Error 404: El número de telefono no existe en la cuenta", {
          position: "center-right",
          style: { transform: "translateY(80vh)" }
        });
        setIsPhoneNew(true); // El teléfono no existe, es nuevo
      }
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      toast.error("Error 404: El número de teléfono no existe en la cuenta", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      setIsPhoneNew(true); // En caso de error, considerar el teléfono como nuevo
    }
  };

  const handleSaveNewPhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Error 400: Ingrese un número de teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 13) {
      toast.warning(
        "Error 400: El número de teléfono debe tener 10 o 11 dígitos",
        {
          position: "top-right"
        }
      );
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("Error 400: No hay una cuenta válida seleccionada", {
        position: "top-right"
      });
      return;
    }

    const idCuenta = searchResults[0].idCuenta;
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

    const newPhoneData = {
      cuenta: idCuenta,
      idEjecutivo: idEjecutivo,
      phoneNumber: phoneNumber,
      telefonia: "fija", // Ajusta estos valores según sea necesario
      claseTelefono: selectedClaseTelefono,
      horarioContacto: horarioContacto,
      extension: 0
    };

    console.log("Horario de contacto:", horarioContacto);
    console.log("Datos enviados:", newPhoneData); // Agrega este log para verificar los datos

    try {
      await fetchNewTel(newPhoneData);
      toast.success("Nuevo número de teléfono guardado", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      setIsPhoneNew(false); // Restablecer el estado del teléfono nuevo
      setPhoneNumber(""); // Limpiar el campo de entrada
      loadData(); // Recargar los datos de los teléfonos
    } catch (error) {
      console.error("Error al guardar el nuevo teléfono:", error);
      toast.error("Error 408: Error al guardar el nuevo teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
    }
  };

  const processPhoneCall = (phoneNumber) => {
    const foundRow = data.find((row) => row.númeroTelefónico === phoneNumber);

    if (foundRow) {
      setSelectedAnswer({
        value: 2,
        dataPhone: {
          idClase: foundRow.idClase,
          titulares: foundRow.titulares,
          conocidos: foundRow.conocidos,
          desconocidos: foundRow.desconocidos,
          sinContacto: foundRow.sinContacto,
          intentosViciDial: foundRow.intentosViciDial,
          id: foundRow.id,
          númeroTelefónico: foundRow.númeroTelefónico,
          idTelefonía: foundRow.idTelefonía,
          idOrigen: foundRow.idOrigen,
          estado: foundRow.estado,
          municipio: foundRow.municipio,
          husoHorario: foundRow.husoHorario,
          segHorarioContacto: foundRow.segHorarioContacto,
          extensión: foundRow.extensión,
          _Confirmado: foundRow._Confirmado,
          fecha_Insert: foundRow.fecha_Insert,
          calificacion: foundRow.calificacion,
          activo: foundRow.activo,
          idModo: 2202
        }
      });
      toast.success(`Número encontrado: ${phoneNumber}`, {
        position: "top-right"
      });
    } else {
      toast.error(`Número no encontrado: ${phoneNumber}`, {
        position: "top-right"
      });
    }
  };

  useEffect(() => {
    if (lastPhoneNumberFromToast) {
      processPhoneCall(lastPhoneNumberFromToast);
    }
  }, [lastPhoneNumberFromToast, data]);

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
        toast.error("Error 404: No hay carga de teléfonos", {
          position: "top-right"
        });
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

  useEffect(() => {
    if (searchResults.length > 0) {
      loadData();
    }
  }, [searchResults]);

  const handleRowClick = async (row) => {
    if (userActiveFlow) {
      toast.warning(
        "No puedes realizar esta acción mientras el flujo está activo."
      );
      return; // Bloquear la acción si el flujo está activo
    }

    const idCuenta = searchResults[0]?.idCuenta; // Obtén el idCuenta del contexto
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo; // Obtén el idEjecutivo
    const numeroTelefonico = row?.númeroTelefónico || phoneNumber; // Número telefónico seleccionado

    // Validaciones iniciales
    if (!numeroTelefonico || numeroTelefonico.trim() === "") {
      toast.warning("Advertencia: Ingrese un número telefónico válido.", {
        position: "top-center"
      });
      return;
    }

    if (!idCuenta || !idEjecutivo) {
      toast.error(
        "Error: Información incompleta para validar el huso horario.",
        {
          position: "top-center"
        }
      );
      return;
    }

    try {
      // Validación del huso horario
      const { isValid, mensaje } = await validateTimeZone(
        idCuenta,
        numeroTelefonico,
        idEjecutivo
      );

      if (isValid) {
        setSelectedAnswer({
          value: row ? 2 : 10, // 2 para llamada manual, 10 para llamada de entrada
          dataPhone: {
            idClase: row?.idClase || 0,
            titulares: row?.titulares || 0,
            conocidos: row?.conocidos || 0,
            desconocidos: row?.desconocidos || 0,
            sinContacto: row?.sinContacto || 0,
            intentosViciDial: row?.intentosViciDial || 0,
            id: row?.id || 0,
            númeroTelefónico: numeroTelefonico,
            idTelefonía: row?.idTelefonía || 0,
            idOrigen: row?.idOrigen || 0,
            estado: row?.estado || 0,
            municipio: row?.municipio || 0,
            husoHorario: row?.husoHorario || 0,
            segHorarioContacto: row?.segHorarioContacto || 0,
            extensión: row?.extensión || 0,
            _Confirmado: row?._Confirmado || 0,
            fecha_Insert: row?.fecha_Insert || 0,
            calificacion: row?.calificacion || 0,
            activo: row?.activo || 0,
            idModo: row ? 2202 : 2201 // 2202 para llamada manual, 2201 para llamada de entrada
          }
        });
      } else {
        toast.error(mensaje, {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error("Error al validar la zona horaria:", error);
      toast.error("Error en la validación del huso horario.", {
        position: "top-center"
      });
    }
  };

  return (
    <Card className="overflow-auto card-phones widgets-container">
      <Card.Body className="card-body-phones">
        <Row>
          <Col xs={2}>
            <h5 className="card-title text-white">
              <TelephoneFill /> Teléfonos
            </h5>
          </Col>
          <Col xs={10}>
            <Table hover variant="dark" className="table" responsive="sm">
              <thead>
                <tr>
                  <th colSpan="3">
                    <div className="button-phones">
                      <Button
                        variant="primary"
                        className="me-2 input-phone"
                        style={{ width: "25%" }}
                        onClick={() => handleRowClick(null)} // Llamada de entrada sin datos de fila
                      >
                        Llamada de entrada
                      </Button>

                      {isPhoneNew && (
                        <>
                          <input
                            type="time"
                            step="2"
                            value={horarioContacto}
                            onChange={(e) => {
                              const [h, m, s] = e.target.value.split(":");
                              setHorarioContacto(
                                `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${
                                  s || "00"
                                }`
                              );
                            }}
                            className="time-input"
                          />

                          <DropdownButton
                            id="dropdown-basic-button"
                            title={selectedClaseTelefono || "Clase de telefono"}
                            onSelect={setSelectedClaseTelefono}
                            className="custom-dropdown-menu"
                          >
                            {[
                              "Hogar",
                              "Tercero",
                              "Familiar",
                              "Empresa Trabajo",
                              "Celular",
                              "Recados",
                              "Oficina",
                              "Baja"
                            ].map((item) => (
                              <Dropdown.Item key={item} eventKey={item}>
                                {item}
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                        </>
                      )}

                      <InputGroup
                        style={{ width: "35%" }}
                        className="input-phone"
                      >
                        <FormControl
                          placeholder="Número de teléfono"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          className="input-validation"
                        />
                        <Button
                          variant="secondary"
                          onClick={
                            isPhoneNew
                              ? handleSaveNewPhone
                              : handleValidatePhone
                          }
                        >
                          {isPhoneNew ? "Nuevo" : "Validar"}
                        </Button>
                      </InputGroup>
                    </div>
                  </th>
                </tr>
              </thead>
            </Table>
          </Col>
        </Row>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>T</th>
                <th>C</th>
                <th>D</th>
                <th>S</th>
                <th>Teléfono</th>
                <th>Telefonía</th>
                <th>Origen</th>
                <th>Clase</th>
                <th>Estado</th>
                <th>Municipio</th>
                <th>Huso Horario</th>
                {/* <th>SEG Horario Contacto</th> */}
                <th>Extensión</th>
                <th>Confirmado</th>
                {/* <th>Fecha INSERT</th> */}
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
                      <td>
                        <a
                          href="#"
                          className="text-info"
                          onClick={() => handleRowClick(row)} // Llamada manual con datos de fila
                        >
                          {"XXXXXX" + row.númeroTelefónico.slice(6)}{" "}
                          {/* Solo muestra los últimos 4 dígitos */}
                        </a>
                      </td>
                      <td>{row.telefonia || "--"}</td>{" "}
                      {/* Muestra el valor de telefonia */}
                      <td>{row.origen || "--"}</td>{" "}
                      {/* Muestra el valor de origen */}
                      <td>{row.clase || "--"}</td>{" "}
                      {/* Muestra el valor de clase */}
                      <td>{row.estado || "--"}</td>
                      <td>{row.municipio || "--"}</td>
                      <td>{row.husoHorario || "--"}</td>
                      {/* <td>{row.segHorarioContacto || "--"}</td> */}
                      <td>{row.extensión || "--"}</td>
                      <td>{row._Confirmado ? "Sí" : "No" || "--"}</td>
                      {/* <td>
                        {new Date(row.fecha_Insert).toLocaleDateString() ||
                          "--"}
                      </td> */}
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
