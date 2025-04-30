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
import { TelephoneFill, Eye, Clipboard2Data } from "react-bootstrap-icons";
import FollowUps from "./memuHamburguesa/Acciones/FollowUps";
import { getPhoneNumberFromContext } from "../utils/phoneUtils"; // Importa la función centralizada

const Telephones = () => {
  const {
    userActiveFlow,
    setSelectedAnswer,
    isDataAllPhones,
    setIsDataAllPhones,
    setSelectedPhoneFilter, // Agregar setSelectedPhoneFilter del contexto
    setSelectedPhoneForFollowUps // Importar setter del contexto
  } = useContext(AppContext);
  const { searchResults, lastPhoneNumberFromToast } = useContext(AppContext);
  const { isManagment, selectedAnswer } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNew, setIsPhoneNew] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const [selectedClaseTelefono, setSelectedClaseTelefono] = useState("");
  const [horarioContacto, setHorarioContacto] = useState("00:00:00");
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null); // Estado para el número seleccionado
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 13) {
      setPhoneNumber(input);
    }
  };


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
        "Error 400: El número de teléfono debe tener 10 o 13 dígitos",
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
      console.log("Enviando solicitud a fetchValidationTel con:", { telefono: phoneNumber, idCuenta });
      const response = await fetchValidationTel({
        telefono: phoneNumber,
        idCuenta
      });

      if (response.exists) {
        toast.success(" El número de teléfono existe en la cuenta", {
          position: "top-right",
          style: { transform: "translateY(80vh)" }
        });
        setIsPhoneNew(false);
      } else {
        toast.error("Error 404: El número de telefono no existe en la cuenta", {
          position: "center-right",
          style: { transform: "translateY(80vh)" }
        });
        setIsPhoneNew(true);
      }
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      toast.error("Error 404: El número de teléfono no existe en la cuenta", {
        position: "top-right"
      });
      setIsPhoneNew(true);
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

    const newPhoneisDataAllPhones = {
      cuenta: idCuenta,
      idEjecutivo: idEjecutivo,
      phoneNumber: phoneNumber,
      telefonia: "fija",
      claseTelefono: selectedClaseTelefono,
      horarioContacto: horarioContacto,
      extension: 0
    };

    console.log("Enviando solicitud a fetchNewTel con:", newPhoneisDataAllPhones);

    try {
      await fetchNewTel(newPhoneisDataAllPhones);
      toast.success("Nuevo número de teléfono guardado", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
      setIsPhoneNew(false);
      setPhoneNumber("");
      loadisDataAllPhones();
    } catch (error) {
      console.error("Error al guardar el nuevo teléfono:", error);
      toast.error("Error 408: Error al guardar el nuevo teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" }
      });
    }
  };

  const processPhoneCall = (phoneNumber) => {
    // En la versión 2 se busca en isDataAllPhones (anteriormente se usaba "data" en la versión 1)
    const foundRow = isDataAllPhones.find(
      (row) => row.númeroTelefónico === phoneNumber
    );

    if (foundRow) {
      setSelectedAnswer({
        value: 2,
        isDataAllPhonesPhone: {
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
  }, [lastPhoneNumberFromToast, isDataAllPhones]);

  const loadisDataAllPhones = async () => {
    setIsLoading(true);
    try {
      console.log("Enviando solicitudes a fetchPhones para searchResults:", searchResults);
      const phones = await Promise.all(
        searchResults.map(async (result) => {
          const response = await fetchPhones(result.idCuenta);
          console.log("Respuesta de fetchPhones para idCuenta:", result.idCuenta, response);
          return response;
        })
      );
      const flatPhones = phones.flat();
      setIsDataAllPhones(flatPhones || []); // Asegúrate de que sea un arreglo
      if (flatPhones.length === 0 && !toastShown) {
        toast.error("Error 404: No hay carga de teléfonos", {
          position: "top-right"
        });
        setToastShown(true);
      }
    } catch (error) {
      console.error("Error al cargar los teléfonos:", error);
      setIsDataAllPhones([]); // En caso de error, asegúrate de que sea un arreglo vacío
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      loadisDataAllPhones();
    }
  }, [searchResults]);

  const handleRowClick = async (row) => {
    if (userActiveFlow) {
      toast.warning(
        "No puedes realizar esta acción mientras el flujo está activo."
      );
      return;
    }

    const idCuenta = searchResults[0]?.idCuenta;
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
    const numeroTelefonico = row?.númeroTelefónico || phoneNumber;

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
      const { isValid, mensaje } = await validateTimeZone(
        idCuenta,
        numeroTelefonico,
        idEjecutivo
      );

      if (isValid) {
        setSelectedAnswer({
          value: row ? 2 : 10,
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
            idModo: row ? 2202 : 2201
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

  const handleEyeClick = (phoneNumber) => {
    if (selectedPhone === phoneNumber) {
      console.log("Deseleccionando número de teléfono:", phoneNumber);
      setSelectedPhone(null); // Deseleccionar
      setSelectedPhoneFilter(null); // Restablecer el filtro en el contexto
      setIsDataAllPhones((prev) => [...prev]); // Restablecer el estado inicial de los teléfonos
    } else {
      console.log("Número de teléfono seleccionado:", phoneNumber);
      setSelectedPhone(phoneNumber); // Seleccionar
      setSelectedPhoneFilter(phoneNumber); // Actualizar el filtro en el contexto
    }
  };

  const handleSendPhoneToFormFollowUps = (phoneNumber) => {
    console.log("Número de teléfono enviado al formulario FormFollowUps:", phoneNumber);

    // Actualiza el número telefónico en el contexto antes de abrir el modal
    setSelectedPhoneForFollowUps(null); // Limpia cualquier número previo
    const phone = getPhoneNumberFromContext({
        isManagment,
        selectedAnswer,
        isDataAllPhones,
        selectedPhoneForFollowUps: phoneNumber
    });
    setSelectedPhoneForFollowUps(phone.raw); // Establece el número correcto
  };

  // 2. Función que abre el modal + usa el número actualizado del row
  const openFollowUpsModal = (row) => {
    const phone = getPhoneNumberFromContext({
        isManagment,
        selectedAnswer,
        isDataAllPhones,
        selectedPhoneForFollowUps: row?.númeroTelefónico
    }); // Usa la función centralizada
    setSelectedAnswer(prev => ({ ...prev, númeroTelefonico: phone.raw }));
    setShowFollowUps(true); // Abre el modal
  };

  return (
    <>
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
                          onClick={() => handleRowClick(null)}
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
                                  `${h.padStart(2, "0")}:${m.padStart(
                                    2,
                                    "0"
                                  )}:${s || "00"}`
                                );
                              }}
                              className="time-input"
                            />

                            <DropdownButton
                              id="dropdown-basic-button"
                              title={
                                selectedClaseTelefono || "Clase de telefono"
                              }
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
                <tr
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "#343a40", // Color de fondo para que coincida con el tema oscuro
                    zIndex: "10"
                  }}
                >
                  <th>T</th>
                  <th>C</th>
                  <th>D</th>
                  <th>S</th>
                  <th>Telefóno</th>
                  <th>Telefonía</th>
                  <th>Origen</th>
                  <th>Clase</th>
                  <th>Estado</th>
                  <th>Municipio</th>
                  <th>Uso Horario</th>
                  <th>Extensión</th> {/* Nuevo campo */}
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
                  : Array.isArray(isDataAllPhones) // Validar que sea un arreglo
                  ? isDataAllPhones.map((row, index) => (
                      <tr key={index}>
                        <td>{row.titulares || "--"}</td>
                        <td>{row.conocidos || "--"}</td>
                        <td>{row.desconocidos || "--"}</td>
                        <td>{row.sinContacto || "--"}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Eye
                              style={{
                                cursor: "pointer",
                                color: selectedPhone === row.númeroTelefónico ? "rgb(57, 252, 141)" : "#d3bbf8"
                              }}
                              onClick={() => handleEyeClick(row.númeroTelefónico)}
                            />
                            <a
                              href="#"
                              className="text-info"
                              onClick={() => handleRowClick(row)}
                              data-full-number={row.númeroTelefónico}
                            >
                              {"XXXXXX" + row.númeroTelefónico.slice(6)}
                            </a>
                            <Clipboard2Data
                              style={{ cursor: "pointer", color: "#fce959" }}
                              onClick={() => {
                                openFollowUpsModal(row);
                                handleSendPhoneToFormFollowUps(row.númeroTelefónico); // Usar la función actualizada
                              }}
                            />
                          </div>
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
                        <td>{row.extensión || "--"}</td>
                      </tr>
                    ))
                  : (
                      <tr>
                        <td colSpan="12" className="text-center">
                          No hay datos disponibles.
                        </td>
                      </tr>
                    )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      <FollowUps
        show={showFollowUps}
        handleClose={() => setShowFollowUps(false)}
        isFollowUpActive={true}
      />
    </>
  );
};

export default Telephones;