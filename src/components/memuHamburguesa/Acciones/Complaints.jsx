import { useState, useContext, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Dropdown,
  Col,
  Spinner,
  Row,
} from "react-bootstrap";
import {
  fetchComplaints,
  fetchViewComplaints,
  fetchOriginComplaints,
  fetchDdComplaints,
  fetchAddress,
  fetchEmailsCharging,
  fetchPhones,
} from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";
import { toast } from "sonner";
import "../../../scss/styles.scss";

const Complaints = ({ show, handleClose }) => {
   const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const { searchResults } = useContext(AppContext);

  const [formData, setFormData] = useState({
    idQueja: "",
    idInstitucion: "",
    folio: "",
    llamadaEntrada: false,
    comentarios: "",
    titular: false,
    solicitante: "",
    idDomicilio: 0,
  });

  const [reportedEmail, setReportedEmail] = useState(""); // Estado para almacenar el correo ingresado
  const [reportedPhone, setReportedPhone] = useState(""); // Estado para almacenar el teléfono ingresado
  const [complaints, setComplaints] = useState([]);
  const [originComplaints, setOriginComplaints] = useState([]); // Estado para almacenar los datos del endpoint
  const [isFormValid, setIsFormValid] = useState(false);
  const [ddComplaints, setDdComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para la animación de carga
  const [showFinancieraSection, setShowFinancieraSection] = useState(false); // Estado para controlar la visibilidad
  const [addresses, setAddresses] = useState([]); // Estado para almacenar los domicilios
  const [showAddressTable, setShowAddressTable] = useState(false); // Estado para mostrar la tabla de domicilios
  const [emails, setEmails] = useState([]); // Estado para almacenar los correos electrónicos
  const [showEmailTable, setShowEmailTable] = useState(false); // Estado para mostrar la tabla de correos electrónicos
  const [showScrollHint, setShowScrollHint] = useState(true); // Estado para controlar la visibilidad del párrafo
  const [phones, setPhones] = useState([]); // Estado para almacenar los teléfonos
  const [showPhoneTable, setShowPhoneTable] = useState(false); // Estado para mostrar la tabla de teléfonos
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Estado para almacenar el idDomicilio seleccionado

  const fetchAndLogPhones = async () => {
    if (searchResults.length === 0 || !searchResults[0].idCuenta) {
      toast.warning(
        "No hay una cuenta válida seleccionada para obtener teléfonos."
      );
      return;
    }

    const idCuenta = searchResults[0].idCuenta;

    try {
      const phones = await fetchPhones(idCuenta); // Llama al endpoint
      console.log("Teléfonos obtenidos:", phones); // Imprime los datos obtenidos
      setPhones(phones); // Almacena los datos en el estado
    } catch (error) {
      console.error("Error al obtener los teléfonos:", error);
    }
  };

  // Validar el formulario dinámicamente
  useEffect(() => {
    const isValid =
      formData.idQueja && // Tipo de queja
      formData.idInstitucion && // Origen
      formData.folio && // Folio
      formData.comentarios; // Comentarios

    setIsFormValid(isValid);
  }, [formData]); // Dependencias actualizadas para validar dinámicamente

  // Efecto para ocultar el párrafo al hacer scroll dentro del modal
  useEffect(() => {
    const handleScroll = () => {
      const modalBody = document.querySelector(".modal-body"); // Selecciona el contenedor del modal
      if (modalBody && modalBody.scrollTop > 0) {
        setShowScrollHint(false); // Oculta el párrafo si se detecta scroll en el modal
      } else {
        setShowScrollHint(true); // Muestra el párrafo si no hay scroll
      }
    };

    const modalBody = document.querySelector(".modal-body");
    modalBody?.addEventListener("scroll", handleScroll); // Agrega el evento de scroll al contenedor del modal

    return () => {
      modalBody?.removeEventListener("scroll", handleScroll); // Limpia el evento al desmontar
    };
  }, [show]); // Asegúrate de que el efecto se registre cada vez que el modal se muestre

  // Cargar las quejas
  useEffect(() => {
    const fetchComplaintsData = async () => {
      if (searchResults.length > 0) {
        const idCuenta = searchResults[0].idCuenta;
        const idCartera = 1;
        try {
          const result = await fetchViewComplaints({ idCartera, idCuenta });
          console.log("Datos recibidos de fetchViewComplaints:", result);
          setComplaints(result);
        } catch (error) {
          toast.error("Error 408: Error al cargar las quejas");
          console.error("Error al cargar las quejas:", error);
        }
      }
    };

    if (show) {
      fetchComplaintsData();
    }
  }, [show, searchResults]);

  // Cargar los orígenes de quejas
  useEffect(() => {
    const fetchOriginData = async () => {
      try {
        console.log("Llamando a fetchOriginComplaints");
        const result = await fetchOriginComplaints();
        console.log("Datos recibidos de fetchOriginComplaints:", result);

        // Mapear los datos para extraer idValor y Valor
        const mappedData = result.map((item) => ({
          id: item.idValor,
          descripcion: item.Valor,
        }));
        setOriginComplaints(mappedData); // Guardar los datos mapeados en el estado
      } catch (error) {
        toast.error("Error al cargar los orígenes de quejas");
        console.error("Error al cargar los orígenes de quejas:", error);
      }
    };

    fetchOriginData();
  }, []);

  // Cargar los tipos de quejas
  useEffect(() => {
    const fetchDdComplaintsData = async () => {
      try {
        console.log("Llamando a fetchDdComplaints");
        const result = await fetchDdComplaints();
        console.log("Datos recibidos de fetchDdComplaints:", result);

        // Mapear los datos para extraer idValor y Valor
        const mappedData = result.map((item) => ({
          id: item.idValor,
          descripcion: item.Valor,
        }));
        setDdComplaints(mappedData); // Guardar los datos mapeados en el estado
      } catch (error) {
        toast.error("Error al cargar los tipos de quejas");
        console.error("Error al cargar los tipos de quejas:", error);
      }
    };

    fetchDdComplaintsData();
  }, []);

  // Cargar los domicilios
  useEffect(() => {
    const fetchAddressData = async () => {
      if (searchResults.length > 0) {
        const idCuenta = searchResults[0].idCuenta;
        const idCartera = 1;
        try {
          console.log(
            "Llamando a fetchAddress con idCartera:",
            idCartera,
            "idCuenta:",
            idCuenta
          );
          const result = await fetchAddress(idCartera, idCuenta);
          console.log("Datos recibidos de fetchAddress:", result);
          setAddresses(result); // Almacena los datos en el estado
        } catch (error) {
          if (error.response?.status === 404) {
            toast.error("No se encontraron domicilios para esta cuenta.");
          } else {
            toast.error("Error al cargar los domicilios.");
          }
          console.error("Error al cargar los domicilios:", error);
        }
      }
    };

    if (show) {
      fetchAddressData(); // Llama al endpoint cuando el modal esté visible
    }
  }, [show, searchResults]);

  // Cargar los correos electrónicos
  useEffect(() => {
    const fetchEmailsData = async () => {
      if (searchResults.length > 0) {
        const idCuenta = searchResults[0].idCuenta;
        const idCartera = 1;
        try {
          console.log(
            "Llamando a fetchEmailsCharging con idCartera:",
            idCartera,
            "idCuenta:",
            idCuenta
          );
          const result = await fetchEmailsCharging(idCartera, idCuenta);
          console.log("Datos recibidos de fetchEmailsCharging:", result);
          setEmails(result); // Almacena los datos en el estado
        } catch (error) {
          toast.error("Error al cargar los correos electrónicos.");
          console.error("Error al cargar los correos electrónicos:", error);
        }
      }
    };

    if (show) {
      fetchEmailsData(); // Llama al endpoint cuando el modal esté visible
    }
  }, [show, searchResults]);

  useEffect(() => {
    if (show) {
      fetchAndLogPhones(); // Llama a la función cuando el modal se muestra
    }
  }, [show]);

  // Manejar cambios en el formulario
  const handleChange = (name, value) => {
    const nombreDeudor = searchResults?.[0]?.nombreDeudor || "";
    console.log(`Cambio detectado en ${name}:`, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "titular" && { solicitante: value ? nombreDeudor : "" }),
    }));
  };

  const handleFolioChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*$/; // Solo permite números

    if (regex.test(value)) {
      handleChange(name, value); // Actualiza el estado si el valor es válido
    } else {
      toast.warning("Solo se permiten números en el folio."); // Muestra un mensaje de advertencia
    }
  };

  const handleDropdownSelect = (value) => {
    const selectedOrigin = originComplaints.find(
      (origin) => origin.id === parseInt(value)
    );
    handleChange("idInstitucion", value); // Actualizar el idInstitucion
    handleChange("institucionDescripcion", selectedOrigin?.descripcion || ""); // Actualizar el texto seleccionado

    // Mostrar la sección si se selecciona "financiera"
    if (selectedOrigin?.descripcion.toLowerCase() === "financiera") {
      setShowFinancieraSection(true);
    } else {
      setShowFinancieraSection(false);
    }
  };

  const handleRowClick = (idDomicilio) => {
    console.log(`Fila seleccionada con idDomicilio: ${idDomicilio}`); // Verifica el idDomicilio en la consola
    setSelectedAddressId(idDomicilio); // Actualiza el idDomicilio seleccionado
    setFormData((prev) => ({
      ...prev,
      idDomicilio, // Actualiza el campo idDomicilio con el valor seleccionado
    }));
  };

  // Manejar el envío del formulario
  const handleReport = async () => {
    // Validar que el correo tenga un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
    if (reportedEmail && !emailRegex.test(reportedEmail)) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      return; // Detiene el envío si el correo no es válido
    }

    const idCuenta =
      searchResults.length > 0 ? searchResults[0].idCuenta : "string";
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });

    // Verifica si el correo ingresado existe en la tabla de correos
    const emailExists = emails.some(
      (email) => email.CorreoElectrónico === reportedEmail
    );

    // Verifica si el teléfono ingresado existe en la tabla de teléfonos
    const phoneExists = phones.some(
      (phone) => "XXXXXX" + phone.númeroTelefónico.slice(6) === reportedPhone
    );

    // Encuentra el número completo en la tabla de teléfonos si existe
    const fullPhone = phones.find(
      (phone) => "XXXXXX" + phone.númeroTelefónico.slice(6) === reportedPhone
    )?.númeroTelefónico;

    // Usa el número completo si existe, de lo contrario usa el valor ingresado
    const cleanPhone = fullPhone || reportedPhone.replace(/^XXXXXX/, "");

    const requestData = {
      idCartera: 1,
      idCuenta: idCuenta,
      fechaInsert: new Date().toISOString().split("T")[0], // Solo la fecha sin la hora
      segundoInsert: currentTime,
      folio: formData.folio,
      idEjecutivoInsert: idEjecutivo,
      idQueja: parseInt(formData.idQueja, 10), // Convertir a número
      idInstitucion: parseInt(formData.idInstitucion, 10), // Convertir a número
      solicitante: formData.solicitante,
      llamadaEntrada: formData.llamadaEntrada,
      numeroTelefonico: phoneExists ? cleanPhone : 0, // Usa el número completo si existe
      correoElectronico: emailExists ? reportedEmail : "", // Si existe, se envía aquí
      idDomicilio: formData.idDomicilio || 0, // Usa el valor seleccionado o 0 por defecto
      comentario: formData.comentarios,
      numeroTelefonicoContacto: phoneExists ? 0 : parseInt(cleanPhone, 10), // Convertir a número
      correoElectronicoContacto: emailExists ? "" : reportedEmail, // Si no existe, se envía aquí
    };

    try {
      setIsLoading(true); // Inicia la animación de carga
      const result = await fetchComplaints(requestData);
      toast.success("Queja guardada exitosamente");

      // Limpia el formulario después de guardar
      setFormData({
        idQueja: "",
        idInstitucion: "",
        folio: "",
        llamadaEntrada: false,
        comentarios: "",
        titular: false,
        solicitante: "",
        idDomicilio: 0,
      });
      setReportedEmail(""); // Limpia el correo ingresado
      setReportedPhone(""); // Limpia el teléfono ingresado

      // Actualiza la tabla de quejas
      const updatedComplaints = await fetchViewComplaints({
        idCartera: 1,
        idCuenta,
      });
      setComplaints(updatedComplaints);
    } catch (error) {
      toast.error("Error al guardar la queja");
      console.error("Error al guardar la queja:", error);
    } finally {
      setIsLoading(false); // Finaliza la animación de carga
    }
  };

  useEffect(() => {
  if (!show) {
    setFormData({
      idQueja: "",
      idInstitucion: "",
      folio: "",
      llamadaEntrada: false,
      comentarios: "",
      titular: false,
      solicitante: "",
      idDomicilio: 0,
    });
    setReportedEmail("");
    setReportedPhone("");
    setShowAddressTable(false);
    setShowEmailTable(false);
    setShowPhoneTable(false);
    setSelectedAddressId(null);
    // Limpia otros estados si es necesario
  }
}, [show]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Quejas</Modal.Title>
        <div className="ms-auto me-3">
          {complaints.length > 0 &&
            showScrollHint && ( 
              <p className="cursor typewriter-animation">Desliza hacia abajo</p>
            )}
        </div>
      </Modal.Header>
      <Modal.Body className="d-block gap-1"  style={{maxHeight: "80vh"}}>
        <Row className="d-block d-lg-flex">
          {complaints.length > 0 ? ( 
            <Col xs={12} lg={6}>
              <Form className="p-2">
                <div className="d-flex gap-2">
                  <Form.Group className="mb-4 w-50">
                    <Dropdown
                      onSelect={(value) => {
                        const selectedComplaint = ddComplaints.find(
                          (complaint) => complaint.id === parseInt(value)
                        );
                        handleChange("idQueja", value); 
                        handleChange(
                          "tipoQuejaDescripcion",
                          selectedComplaint?.descripcion || ""
                        ); 
                        if (
                          selectedComplaint?.descripcion ===
                          "Domicilio no corresponde"
                        ) {
                          setShowAddressTable(true);
                        } else {
                          setShowAddressTable(false);
                        }
                        if (
                          selectedComplaint?.descripcion ===
                          "Email no corresponde"
                        ) {
                          setShowEmailTable(true);
                        } else {
                          setShowEmailTable(false);
                        }
                        if (
                          selectedComplaint?.descripcion ===
                          "Teléfono no corresponde"
                        ) {
                          setShowPhoneTable(true);
                        } else {
                          setShowPhoneTable(false); 
                        }
                      }}
                    > 
                   
                      <Dropdown.Toggle
                        className="dropdown-queja w-100"
                        variant="primary"
                        id="scroll-container">
                        <p id="dropdown-queja">{formData.tipoQuejaDescripcion || "Seleccionar tipo de queja"}</p>
                      </Dropdown.Toggle>    
                      <Dropdown.Menu className="dropdown-menu">
                        {ddComplaints.length > 0 ? (
                          ddComplaints.map((complaint) => (
                            <Dropdown.Item
                              key={complaint.id}
                              eventKey={complaint.id}
                            >
                              {complaint.descripcion}
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item disabled>
                            No hay datos disponibles
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <Form.Group className="mb-4 w-50">
                    <Dropdown onSelect={handleDropdownSelect}>
                       
                      <Dropdown.Toggle
                        className="w-100"
                        variant="primary"
                        id="dropdown-institucion"
                      >
                        {formData.institucionDescripcion || "Origen"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu">
                        {originComplaints.length > 0 ? (
                          originComplaints.map((origin) => (
                            <Dropdown.Item key={origin.id} eventKey={origin.id}>
                              {origin.descripcion}
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item disabled>
                            No hay datos disponibles
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </div>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="folio"
                    placeholder="Folio"
                    value={formData.folio}
                    onChange={handleFolioChange} 
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Check
                    key={formData.llamadaEntrada} 
                    type="checkbox"
                    label="Llamada de entrada"
                    name="llamadaEntrada"
                    checked={formData.llamadaEntrada}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.checked)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <textarea
                    className="form-control"
                    rows={3}
                    name="comentarios"
                    placeholder="Escribir comentario"
                    value={formData.comentarios}
                    onChange={(e) => {
                      console.log("Valor del textarea:", e.target.value); 
                      handleChange(e.target.name, e.target.value); 
                    }}
                    onKeyDown={(e) => e.key === " " && e.stopPropagation()}
                  />
                </Form.Group>
                {showFinancieraSection && ( 
                  <div className="">
                    <Form.Group className="mb-4 mt-2 half-width">
                      <Form.Check
                        key={formData.titular} 
                        type="checkbox"
                        label="Titular"
                        name="titular"
                        checked={formData.titular}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.checked)
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 w-100 half-width">
                      <Form.Control
                        className="w-100"
                        type="text"
                        name="solicitante"
                        placeholder="Nombre"
                        value={formData.solicitante}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                    </Form.Group>
                  </div>
                )}
                {formData.tipoQuejaDescripcion === "Email no corresponde" && (
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Correo Electrónico Reportado</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={reportedEmail} 
                      onChange={(e) => setReportedEmail(e.target.value)} 
                    />
                  </Form.Group>
                )}
                {formData.tipoQuejaDescripcion ===
                  "Teléfono no corresponde" && (
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput2"
                  >
                    <Form.Label>Teléfono Reportado</Form.Label>
                    <Form.Control
                      type="text"  
                      placeholder="Numero de telefono"
                      value={reportedPhone}  
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^[0-9]{0,13}$/;  
                        if (regex.test(value)) {
                          setReportedPhone(value); 
                        }
                      }}
                      onBlur={() => {
                        if (
                          reportedPhone.length < 10 ||
                          reportedPhone.length > 13
                        ) {
                          toast.error(
                            "El número de teléfono debe tener entre 10 y 13 dígitos."
                          );
                          setReportedPhone("");
                        }
                      }}
                    />
                  </Form.Group>
                )}
                <div className="boton-reportar">
                  <Button
                    className="mt-3 full-width"
                    variant="danger"
                    onClick={handleReport}
                    disabled={!isFormValid || isLoading} 
                  >
                    {isLoading ? "Guardando..." : "Reportar"}
                  </Button>
                </div>
              </Form>
              <style >{`
                .form-row {
                  display: flex;
                  justify-content: space-between;
                }
                .full-width {
                  width: 100%;
                }
                .half-width {
                  width: 48%;
                }
                .dropdown-menu {
                  max-height: 300px;
                  overflow-y: auto;
                }
                .boton-reportar {
                  margin-top: auto;
                  margin-bottom: 2rem;
                }
              `}</style>
            </Col>
          ) : (
            <p className="text-center">No hay datos disponibles</p>
          )}
          {showAddressTable && ( 
            <Col xs={12} lg={6}>
              {addresses.domicilios?.length > 0 && ( 
                <div className="addresses-section">
                  <p style={{color: " #f1a441", textAlign: "center"}}>Selecciona un domicilio</p>
                  <div
                    className="table-container custom-scrollbar"
                    style={{ maxHeight: "50vh", overflowY: "auto" }}
                  >
                    <Table
                      striped
                      bordered
                      hover
                      variant="dark"
                      style={{ tableLayout: "auto", whiteSpace: "nowrap" }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: -1,
                          backgroundColor: "#343a40",
                          zIndex: 20,
                        }}
                      >
                        <tr>
                          <th>Calle</th>
                          <th>Número Exterior</th>
                          <th>Número Interior</th>
                          <th>Colonia</th>
                          <th>Delegación/Municipio</th>
                          <th>Estado</th>
                          <th>Código Postal</th>
                          <th>Clase</th>
                          <th>Origen</th>
                          <th>Información</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addresses.domicilios.map((address, index) => (
                          <tr
                            key={index}
                            onClick={() => handleRowClick(address.idDomicilio)} 
                            style={{ cursor: "pointer" }}
                            className={
                              selectedAddressId === address.idDomicilio
                                ? "selected-row"
                                : ""
                            }
                          >
                            <td style={{ textAlign: "left" }}>
                              {address.calle || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.númeroExterior || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.númeroInterior || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.coloniaLocalidad || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.delegaciónMunicipio || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.estado || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.códigoPostal || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.clase || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.orígen || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {address.información || "--"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </Col>
          )}
          {showEmailTable && ( 
            <Col xs={12} lg={6}>
              {emails.length > 0 ? ( 
                <div className="emails-section">
                   <p style={{color: " #f1a441", textAlign: "center"}}>Selecciona un correo</p>
                  <div
                    className="table-responsive custom-scrollbar "
                    style={{ maxHeight: "50vh", overflowY: "auto" }}
                  >
                    <Table
                      striped
                      bordered
                      hover
                      variant="dark"
                      style={{ tableLayout: "auto", whiteSpace: "nowrap" }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: -1,
                          backgroundColor: "#343a40",
                          zIndex: 20,
                        }}
                      >
                        <tr>
                          <th>Correo Electronico</th>
                          <th>Origen</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.map((email, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              setReportedEmail(email.CorreoElectrónico || "")
                            } 
                            style={{ cursor: "pointer" }} 
                          >
                            <td style={{ textAlign: "left" }}>
                              {email.CorreoElectrónico || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {email.Origen || "--"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {email.Fecha_Insert?.split("T")[0] || "--"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p className="text-center">
                  No hay correos electrónicos disponibles
                </p>
              )}
            </Col>
          )}
          {showPhoneTable && ( 
            <Col xs={12} lg={6}>
              <div className="emails-telefonos">
              <p style={{color: " #f1a441", textAlign: "center"}}>Selecciona un telefono</p>
                <div
                  className="table-responsive custom-scrollbar"
                  style={{ maxHeight: "50vh", overflowY: "auto" }}
                >
                  <Table
                    striped
                    bordered
                    hover
                    variant="dark"
                    style={{ tableLayout: "auto", whiteSpace: "nowrap" }}
                  >
                    <thead
                      style={{
                        position: "sticky",
                        top: -1,
                        backgroundColor: "#343a40",
                        zIndex: 20,
                      }}
                    >
                      <tr>
                        <th>ID</th>
                        <th>Teléfono</th>
                        <th>Telefonía</th>
                        <th>Origen</th>
                        <th>Clase</th>
                        <th>Confirmado</th>
                        <th>Activo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phones.map((phone, index) => (
                        <tr
                          key={index}
                          onClick={() =>
                            setReportedPhone(
                              "XXXXXX" + phone.númeroTelefónico.slice(6) || "--"
                            )
                          } 
                          style={{ cursor: "pointer" }} 
                        >
                          <td>{phone.id || "0"}</td>
                          <td>
                            {"XXXXXX" + phone.númeroTelefónico.slice(6) || "--"}
                          </td>
                          <td>{phone.telefonia || "--"}</td>
                          <td>{phone.origen || "--"}</td>
                          <td>{phone.clase || "--"}</td>
                          <td>{phone.confirmado || "--"}</td>
                          <td>{phone.activo || "--"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <Row
          className="table-responsive custom-scrollbar w-100 p-3 pt-0 mt-5"
          style={{
            maxHeight: "70vh",
            maxWidth: "1210px",
            minWidth: "250px",
            overflow: "auto", 
          }}
        >
          <Table
            striped
            bordered
            hover
            variant="dark"
            style={{ tableLayout: "auto", whiteSpace: "nowrap" }} 
          >
            <thead
              style={{
                position: "sticky",
                top: -2,
                backgroundColor: "#343a40",
                zIndex: 1,
              }}
            >
              <tr>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "center" }}>Hora</th>
                <th style={{ textAlign: "center" }}>Folio</th>
                <th style={{ textAlign: "center" }}>Queja</th>
                <th style={{ textAlign: "center" }}>Institución</th>
                <th style={{ textAlign: "center" }}>Solicitante</th>
                <th style={{ textAlign: "center" }}>Teléfono</th>
                <th style={{ textAlign: "center" }}>CorreoElectronico</th>
                <th style={{ textAlign: "center" }}>Comentario</th>
                <th style={{ textAlign: "center" }}>TelefonoContacto</th>
                <th style={{ textAlign: "center" }}>CorreoContacto</th>
                <th style={{ textAlign: "center" }}>Domicilio</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="12" className="text-center">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : (
                complaints.map((complaint, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Fecha_Insert?.split("T")[0] || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Segundo_Insert || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.Folio === "object" &&
                      Object.keys(complaint.Folio).length === 0
                        ? "--"
                        : complaint.Folio || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Queja || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Institución || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Solicitante || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.NúmeroTelefónico === "object" &&
                      Object.keys(complaint.NúmeroTelefónico).length === 0
                        ? "--"
                        : complaint.NúmeroTelefónico || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.CorreoElectrónico === "object" &&
                      Object.keys(complaint.CorreoElectrónico).length === 0
                        ? "--"
                        : complaint.CorreoElectrónico || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Comentario || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.TeléfonoContacto === "object" &&
                      Object.keys(complaint.TeléfonoContacto).length === 0
                        ? "--"
                        : complaint.TeléfonoContacto || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.CorreoContacto === "object" &&
                      Object.keys(complaint.CorreoContacto).length === 0
                        ? "--"
                        : complaint.CorreoContacto || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.idDomicilio === "object" &&
                      Object.keys(complaint.idDomicilio).length === 0
                        ? "--"
                        : complaint.idDomicilio || "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Row>
      </Modal.Body>
      <style >{`
        /* Estilos para la tabla oscura con filas alternadas */
        .table-dark {
          --bs-table-striped-bg: #2c3034; /* Color de fondo de filas alternadas */
          --bs-table-striped-color: #ffffff; /* Color de texto en filas alternadas */
        }

        /* Estilo para filas seleccionadas */
        .selected-row > td {
          background-color: rgb(0, 157.0684931507, 218.4) !important;
          color: white !important;
          --bs-table-striped-bg: rgb(0, 157.0684931507, 218.4) !important;
        }

        /* Estilo para hover en filas (ya que usas hover) */
        .table-dark tbody tr:hover > td {
          --bs-table-hover-bg: #323539;
          --bs-table-hover-color: #fff;
        }

        /* Asegurar que las filas alternadas mantengan su color */
        .table-dark.table-striped > tbody > tr:nth-of-type(odd) > td {
          background-color: var(--bs-table-striped-bg);
          color: var(--bs-table-striped-color);
        }
      `}</style>
    </Modal>
  );
};

export default Complaints;
