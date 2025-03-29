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
} from "react-bootstrap";
import {
  fetchPhones,
  fetchValidationTel,
  fetchNewTel,
} from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";
import "../scss/styles.scss";
import { TelephoneFill } from "react-bootstrap-icons";
import axios from "axios"; // Asegúrate de tener axios instalado

const Telephones = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNew, setIsPhoneNew] = useState(false);
  const { searchResults, setSelectedAnswer, lastPhoneNumberFromToast } =
    useContext(AppContext);

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
  const token = responseData?.ejecutivo?.token;

  const handleValidatePhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Ingrese un número de teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" },
      });
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 13) {
      toast.warning(
        "Error 400: El número de teléfono debe tener 10 o 11 dígitos",
        {
          position: "top-right",
        }
      );
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("Error 404: No hay una cuenta válida seleccionada", {
        position: "top-right",
      });
      return;
    }

    const idCuenta = searchResults[0].idCuenta;

    try {
      const response = await fetchValidationTel({
        telefono: phoneNumber,
        idCuenta,
      });

      if (response.exists) {
        toast.success(" El número de teléfono existe en la cuenta", {
          position: "top-right",
          style: { transform: "translateY(80vh)" },
        });
        setIsPhoneNew(false); // El teléfono existe, no es nuevo
      } else {
        toast.error("Error 404: El número de telefono no existe en la cuenta", {
          position: "center-right",
          style: { transform: "translateY(80vh)" },
        });
        setIsPhoneNew(true); // El teléfono no existe, es nuevo
      }
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      toast.error("Error 404: El número de teléfono no existe en la cuenta", {
        position: "top-right",
        style: { transform: "translateY(80vh)" },
      });
      setIsPhoneNew(true); // En caso de error, considerar el teléfono como nuevo
    }
  };

  const handleSaveNewPhone = async () => {
    if (!phoneNumber.trim()) {
      toast.warning("Error 400: Ingrese un número de teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" },
      });
      return;
    }
    if (phoneNumber.length !== 10 && phoneNumber.length !== 13) {
      toast.warning(
        "Error 400: El número de teléfono debe tener 10 o 11 dígitos",
        {
          position: "top-right",
        }
      );
      return;
    }
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning("Error 400: No hay una cuenta válida seleccionada", {
        position: "top-right",
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
      extension: 0,
    };

    console.log("Horario de contacto:", horarioContacto);
    console.log("Datos enviados:", newPhoneData); // Agrega este log para verificar los datos

    try {
      await fetchNewTel(newPhoneData);
      toast.success("Nuevo número de teléfono guardado", {
        position: "top-right",
        style: { transform: "translateY(80vh)" },
      });
      setIsPhoneNew(false); // Restablecer el estado del teléfono nuevo
      setPhoneNumber(""); // Limpiar el campo de entrada
      loadData(); // Recargar los datos de los teléfonos
    } catch (error) {
      console.error("Error al guardar el nuevo teléfono:", error);
      toast.error("Error 408: Error al guardar el nuevo teléfono", {
        position: "top-right",
        style: { transform: "translateY(80vh)" },
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
        },
      });
      toast.success(`Número encontrado: ${phoneNumber}`, {
        position: "top-right",
      });
    } else {
      toast.error(`Número no encontrado: ${phoneNumber}`, {
        position: "top-right",
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
          position: "top-right",
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

  // Método para validar el huso horario
  const validateTimeZone = async (idCuenta, numeroTelefonico, idEjecutivo) => {
    try {
      // Obtener el token de manera similar a como lo haces en agregarCorreo
      const token = responseData?.ejecutivo?.token;

      // Verificar si el token está disponible y agregar un console.log para visualizarlo
      if (!token) {
        console.error("Error: Token no disponible.");
        return {
          isValid: false,
          mensaje:
            "Error: No se encontró un token válido para la autenticación.",
        };
      }

      // Mostrar el token que se está pasando en la solicitud
      console.log("Token que se está pasando:", token);

      // Limpieza de los parámetros
      const cleanIdCuenta = String(idCuenta).trim();
      const cleanNumeroTelefonico = String(numeroTelefonico).trim();
      const cleanIdEjecutivo = String(idEjecutivo).trim();

      // Construcción de la URL con parámetros de consulta
      const url = `/api/ejecutivo/UsosHorarios/1/${cleanIdCuenta}/${cleanNumeroTelefonico}/${cleanIdEjecutivo}`;

      // Realizar la solicitud al servidor utilizando el token en la cabecera
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token como en agregarCorreo
        },
      });

      // Verificar si la respuesta es un JSON válido
      if (response.headers["content-type"]?.includes("application/json")) {
        const data = response.data;

        // Verificar la respuesta de la API
        if (Array.isArray(data) && data.length > 0 && data[0]?.Mensaje) {
          const mensaje = data[0].Mensaje;
          if (mensaje === "La marcación es válida") {
            return { isValid: true, mensaje };
          } else {
            return { isValid: false, mensaje };
          }
        } else {
          console.error("Estructura inesperada en la respuesta:", data);
          return {
            isValid: false,
            mensaje: "Error: Respuesta inesperada del servidor.",
          };
        }
      } else {
        console.error(
          "El servidor devolvió un contenido no JSON:",
          response.data
        );
        return {
          isValid: false,
          mensaje: "Error: El servidor devolvió un contenido no válido.",
        };
      }
    } catch (error) {
      console.error("Error al validar el huso horario:", error);
      return {
        isValid: false,
        mensaje:
          error.response?.data?.message ||
          "Error al validar el huso horario. Intente nuevamente.",
      };
    }
  };

  // METODO DE HORARIO

  return (
    <Card className="overflow-auto card-phones">
      <Card.Body className="card-body-phones">
        <h5 className="card-title text-white">
          <TelephoneFill /> Teléfonos
        </h5>
        <Table hover variant="dark" className="table" responsive="sm">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="button-phones">
                  <Button
                    variant="primary"
                    className="me-2 input-phone"
                    style={{ width: "25%" }}
                    onClick={async () => {
                      const idCuenta = searchResults[0]?.idCuenta; // Obtén el idCuenta del contexto
                      const idEjecutivo =
                        responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo; // Obtén el idEjecutivo
                      const numeroTelefonico = phoneNumber; // Número telefónico seleccionado

                      // Agregar logs para depuración
                      console.log("idCuenta:", idCuenta);
                      console.log("idEjecutivo:", idEjecutivo);
                      console.log("numeroTelefonico:", numeroTelefonico);

                      // Validación específica para numeroTelefonico
                      if (!numeroTelefonico || numeroTelefonico.trim() === "") {
                        toast.error(
                          "Error: Ingrese un número telefónico válido.",
                          {
                            position: "top-center",
                          }
                        );
                        return;
                      }

                      if (!idCuenta || !idEjecutivo) {
                        toast.error(
                          "Error: Información incompleta para validar el huso horario.",
                          {
                            position: "top-center",
                          }
                        );
                        return;
                      }

                      const { isValid, mensaje } = await validateTimeZone(
                        idCuenta,
                        numeroTelefonico,
                        idEjecutivo
                      );

                      if (isValid) {
                        setSelectedAnswer({
                          value: 10,
                          dataPhone: {
                            idClase: 0,
                            titulares: 0,
                            conocidos: 0,
                            desconocidos: 0,
                            sinContacto: 0,
                            intentosViciDial: 0,
                            id: 0,
                            númeroTelefónico: numeroTelefonico,
                            idTelefonía: 0,
                            idOrigen: 0,
                            estado: 0,
                            municipio: 0,
                            husoHorario: 0,
                            segHorarioContacto: 0,
                            extensión: 0,
                            _Confirmado: 0,
                            fecha_Insert: 0,
                            calificacion: 0,
                            activo: 0,
                          },
                        }); // Enviar valor 10 al Form.Check en Flow.jsx
                      } else {
                        toast.error(mensaje, {
                          position: "top-center",
                        });
                      }
                    }}
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
                          "Baja",
                        ].map((item) => (
                          <Dropdown.Item key={item} eventKey={item}>
                            {item}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </>
                  )}

                  <InputGroup style={{ width: "35%" }} className="input-phone">
                    <FormControl
                      placeholder="Número de teléfono"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="input-validation"
                    />
                    <Button
                      variant="secondary"
                      onClick={
                        isPhoneNew ? handleSaveNewPhone : handleValidatePhone
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

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table striped bordered hover variant="dark">
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
                      <td>
                        <a
                          href="#"
                          className="text-info"
                          onClick={() =>
                            setSelectedAnswer({
                              value: 2,
                              dataPhone: {
                                idClase: row.idClase,
                                titulares: row.titulares,
                                conocidos: row.conocidos,
                                desconocidos: row.desconocidos,
                                sinContacto: row.sinContacto,
                                intentosViciDial: row.intentosViciDial,
                                id: row.id,
                                númeroTelefónico: row.númeroTelefónico,
                                idTelefonía: row.idTelefonía,
                                idOrigen: row.idOrigen,
                                estado: row.estado,
                                municipio: row.municipio,
                                husoHorario: row.husoHorario,
                                segHorarioContacto: row.segHorarioContacto,
                                extensión: row.extensión,
                                _Confirmado: row._Confirmado,
                                fecha_Insert: row.fecha_Insert,
                                calificacion: row.calificacion,
                                activo: row.activo,
                              },
                            })
                          }
                        >
                          {"XXXXXX" + row.númeroTelefónico.slice(6)}
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
