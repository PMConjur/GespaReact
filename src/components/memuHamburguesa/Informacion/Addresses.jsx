import { useState, useEffect, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";
import { AppContext } from "../../../pages/Managment"; // Asegúrate de que la ruta sea correcta
import { formatearFecha } from "../../ValoresCatalogos.js";

const Addresses = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext); // Obtén el contexto
  const [formData, setFormData] = useState({
    calle: "",
    numExt: "",
    numInt: "",
    colonia: "",
    municipio: "",
    estado: "",
    origen: "Gestión",
    fecha: "",
  });
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [tableDomicilioData, setTableDomicilioData] = useState([]);
  const [isPostalTableVisible, setIsPostalTableVisible] = useState(false);
  const [postalTableData, setPostalTableData] = useState([]);
  const [selectedDomicilio, setSelectedDomicilio] = useState(null);
  const [clase, setClase] = useState(""); // Agregar esta línea
  const [isEstadoVisible, setIsEstadoVisible] = useState(false); // Agregar esta línea
  const [tableDomData, setTableDomData] = useState([]); // Asegúrate de que esta línea esté presente
  const [isFormDisabled, setIsFormDisabled] = useState(false); // Nuevo estado para controlar la habilitación del formulario
  const [isDomicilioTableVisible, setIsDomicilioTableVisible] = useState(true); // Nuevo estado para controlar la visibilidad de la tabla de domicilios
  const [idInformacion, setIdInformacion] = useState(""); // Nuevo estado para el dropdown
  // Obtener el idCuenta del primer resultado de searchResults
  const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null;
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  // Obtener dirección y visitas
  useEffect(() => {
    if (show) {
      fetchAddressData();
      fetchTableDomData();
      fetchTableDomicilioData();
    }
  }, [show]);

  const fetchAddressData = async () => {
    if (!idCuenta) {
      const errorText = "ID de cuenta no válido. Por favor, verifique.";
      if (errorMessage !== errorText) {
        toast.dismiss();
        toast.error(errorText);
        setErrorMessage(errorText);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(`/direccion/${idCuenta}`);
      if (response.data) {
        setFormData(response.data);
        setIsNew(false);
        setRecordCount(1);
      } else {
        setIsNew(true);
        setRecordCount(0);
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
      let message = "No se pudo cargar la dirección.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? ""
            : `Error ${status}: ${error.response.data.message}`;
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      if (errorMessage !== message) {
        toast.dismiss();
        toast.error(message);
        setErrorMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/search-customer/search-postal-code?codigoPostal=${codigoPostal}`
      );
      setTableData(response.data || []);
    } catch (error) {
      console.error("Error fetching table data:", error);

      let message = "No se pudo cargar la tabla.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? "No se encontraron datos para la cuenta especificada."
            : `Error ${status}: ${error.response.data.message}`;
      } else if (error.request) {
        message = "Error: No se recibió respuesta del servidor.";
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      toast.dismiss(); // Cierra cualquier toast abierto
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el botón de acción (Nuevo / Identificar)
  const handleAction = async () => {
    if (isNew) {
      toast.info("Creando un nuevo registro...");
      setFormData({
        calle: "",
        numExt: "",
        numInt: "",
        codigoPostal: "",
        colonia: "",
        municipio: "",
        estado: "",
        origen: "Gestión",
      });
    } else {
      try {
        await servicio.put("/direccion/actualizar", formData);
        toast.success("Dirección actualizada.");
      } catch (error) {
        toast.error("No se pudo actualizar.");
      }
    }
  };

  const fetchTableDomData = async () => {
    if (!idCuenta) {
      const errorText = "ID de cuenta no válido. Por favor, verifique.";
      if (errorMessage !== errorText) {
        console.log("Mostrando toast con mensaje:", errorText);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(errorText);
        setErrorMessage(errorText);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", errorText);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/ejecutivo/Domicilios/1/${idCuenta}`
      );
      const sanitizedData = (response.data || []).map((item) => ({
        ...item,
        Fecha: item.Fecha || "",
        Hora: item.Hora || "",
        idContacto: item.idContacto || "",
        idSituación: item.idSituación || "",
        // Agrega más campos según sea necesario
      }));
      setTableDomData(sanitizedData);
    } catch (error) {
      console.error("Error fetching table dom data:", error);

      let message = "No se pudo cargar la tabla de direcciones.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? "No se encontraron datos para la cuenta especificada."
            : `Error ${status}: ${error.response.data.message}`;
      } else if (error.request) {
        message = "Error: No se recibió respuesta del servidor.";
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      if (errorMessage !== message) {
        console.log("Mostrando toast con mensaje:", message);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(message);
        setErrorMessage(message);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableDomicilioData = async () => {
    if (!idCuenta) {
      const errorText = "ID de cuenta no válido. Por favor, verifique.";
      if (errorMessage !== errorText) {
        console.log("Mostrando toast con mensaje:", errorText);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(errorText);
        setErrorMessage(errorText);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", errorText);
      }
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Obtén el token del almacenamiento local
      const response = await servicio.get(
        `/search-customer/domicilios-visitas?idCartera=1&idCuenta=${idCuenta}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token aquí
          },
        }
      );

      // Normaliza los datos
      const sanitizedData = (response.data.domicilios || []).map((item) => ({
        calle: item.calle || "",
        númeroExterior: item.númeroExterior || "",
        númeroInterior: item.númeroInterior || "",
        códigoPostal: item.códigoPostal || "",
        coloniaLocalidad: item.coloniaLocalidad || "",
        delegaciónMunicipio: item.delegaciónMunicipio || "",
        estado: item.estado || "",
        clase: item.clase || "",
        orígen: item.orígen || "",
        información: item.información || "",
        idDomicilio: item.idDomicilio || "",
        fecha: item.fecha || "",
      }));

      setTableDomicilioData(sanitizedData);
    } catch (error) {
      console.error("Error fetching domicilio data:", error);

      let message = "No se pudo cargar la tabla de domicilios.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? "No se encontraron datos para la cuenta especificada."
            : `Error ${status}: ${error.response.data.message}`;
      } else if (error.request) {
        message = "Error: No se recibió respuesta del servidor.";
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      if (errorMessage !== message) {
        console.log("Mostrando toast con mensaje:", message);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(message);
        setErrorMessage(message);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFechaInsert = async (idDomicilio) => {
    try {
      const response = await servicio.get(`/domicilios/fecha-insert/${idDomicilio}`);
      return response.data.Fecha_Insert || ""; // Devuelve la Fecha_Insert o una cadena vacía
    } catch (error) {
      console.error("Error al obtener la Fecha_Insert:", error);
      toast.error("No se pudo obtener la Fecha_Insert.");
      return "";
    }
  };

  const renderCell = (value) => {
    if (value === null || value === undefined || typeof value === "object") {
      return ""; // Valor predeterminado
    }
    return value;
  };
  const handleRowClick = (item) => {
    // console.log("Selected gestion:", item);
    setSelectedGestion(item); // Asigna el item seleccionado a selectedGestion
  };

  const handleDomicilioSelection = async (selectedCodigoPostal) => {
    setFormData((prev) => ({
      ...prev,
      codigoPostal: selectedCodigoPostal,
    }));
    toast.info(`Código Postal seleccionado: ${selectedCodigoPostal}`);

    // Llama al endpoint para actualizar la tabla "Postal"
    try {
      setIsLoading(true);
      const response = await servicio.get(
        `/search-customer/search-postal-code?codigoPostal=${selectedCodigoPostal}`
      );
      setPostalTableData(response.data.codigosPostales || []); // Actualiza los datos de la tabla "Postal"
      setIsPostalTableVisible(true); // Muestra la tabla postal
      toast.success("Datos de la tabla Postal actualizados.");
    } catch (error) {
      console.error("Error al actualizar la tabla Postal:", error);
      toast.error("No se pudo actualizar la tabla Postal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddressInformation = (selectedDomicilio) => {
    console.log("Domicilio seleccionado:", selectedDomicilio);
    if (selectedDomicilio.información === "Sin verificar") {
      setIsEstadoVisible(true);
      setSelectedDomicilio(selectedDomicilio);
      console.log("Formulario visible");
    } else {
      setIsEstadoVisible(false);
      setSelectedDomicilio(null);
      console.log("Formulario oculto");
      toast.info("El domicilio seleccionado ya ha sido verificado.");
    }
  };

  const handleSubmitAddressInformation = async () => {
    if (!selectedDomicilio || !estado) {
      toast.error("Por favor, seleccione un domicilio y un estado válido.");
      return;
    }

    const payload = {
      idCartera: 1,
      idCuenta: idCuenta,
      idDomicilio: selectedDomicilio.idDomicilio,
      idInformacion: parseInt(estado, 10),
    };

    try {
      setIsLoading(true);
      const response = await servicio.post(
        "/search-customer/update-address-information",
        payload
      );
      toast.success("Información del domicilio actualizada exitosamente.");
      console.log("Respuesta del servidor:", response.data);
      setIsEstadoVisible(false); // Oculta el formulario después de actualizar
    } catch (error) {
      console.error("Error al actualizar la información del domicilio:", error);
      toast.error("No se pudo actualizar la información del domicilio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewButtonClick = () => {
    if (isFormDisabled) {
      // Si hay un registro seleccionado, limpia los campos y habilita el formulario
      clearFormFields();
      setIsDomicilioTableVisible(false); // Oculta la tabla de domicilios
      toast.info("Formulario listo para un nuevo registro.");
    } else {
      toast.error("El formulario ya está listo para un nuevo registro.");
    }
  };

  const clearFormFields = () => {
    setFormData({
      calle: "",
      numExt: "",
      numInt: "",
      codigoPostal: "",
      colonia: "",
      municipio: "",
      estado: "",
      origen: "Gestión",
    });
    setClase(""); // Limpia el campo "Clase"
    setIsFormDisabled(false); // Habilita el formulario
    setIsDomicilioTableVisible(true); // Muestra la tabla de domicilios
  };

  const handlePostalRowClick = (item) => {
    setFormData((prev) => ({
      ...prev,
      colonia: item.colonia || "",
      municipio: item.municipio || "",
      estado: item.estado || "",
    }));
    toast.info("Datos cargados desde la tabla postal.");
  };

  const handleDomicilioRowClick = async (item) => {
    if (
      formData.calle === item.calle &&
      formData.numExt === item.númeroExterior &&
      formData.numInt === item.númeroInterior &&
      formData.codigoPostal === item.códigoPostal &&
      formData.colonia === item.coloniaLocalidad &&
      formData.municipio === item.delegaciónMunicipio &&
      formData.estado === item.estado &&
      formData.fecha === item.fecha && // Comparar también la fecha
      clase === item.clase
    ) {
      // Si el mismo row está seleccionado, limpia el formulario y habilítalo
      clearFormFields();
      setIdInformacion(""); // Limpia el campo de "Información Actual"
      toast.info("Formulario limpiado y habilitado.");
    } else {
      // Obtener la Fecha_Insert desde la base de datos
      const fechaInsert = await fetchFechaInsert(item.idDomicilio);

      // Si es un row diferente, carga los datos en el formulario
      setFormData({
        calle: item.calle || "",
        numExt: item.númeroExterior || "",
        numInt: item.númeroInterior || "",
        codigoPostal: item.códigoPostal || "",
        colonia: item.coloniaLocalidad || "",
        municipio: item.delegaciónMunicipio || "",
        estado: item.estado || "",
        origen: item.orígen || "Gestión",
        fecha: fechaInsert, // Actualizar el campo Fecha con la Fecha_Insert
      });
      setClase(item.clase || ""); // Actualiza el campo "Clase" en el formulario
      setIsFormDisabled(true); // Deshabilita el formulario
      toast.info("Datos cargados desde la tabla Domicilios.");

      // Verificar si el idInformacion es "Sin verificar (1901)"
      if (item.información === "Sin verificar") {
        setIdInformacion(""); // Limpia el dropdown
        setIsEstadoVisible(true); // Muestra el dropdown
        toast.info("Seleccione una información para identificar.");
      } else {
        setIdInformacion(item.información); // Muestra el valor actual en el nuevo campo
        setIsEstadoVisible(false); // Oculta el dropdown para evitar cambios
        toast.info(`Información actual: ${item.información}`);
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        clearFormFields(); // Limpia los campos al cerrar el modal
      }}
      size="xl"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Domicilios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            {/* Tablas a la izquierda */}
            <Col md={8}>
              {isDomicilioTableVisible && ( // Renderiza la tabla de domicilios solo si está visible
                <div
                  className="scroll-container"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    overflowY: "auto",
                    display: "flex",
                    backgroundColor: "#343a40",
                    color: "#ffffff",
                    scrollbarColor: "#6c757d #343a40",
                    scrollbarWidth: "thin",
                  }}
                >
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    variant="dark"
                    style={{ fontSize: "13px" }}
                  >
                    <thead
                      style={{
                        position: "sticky",
                        top: -1,
                        zIndex: 1,
                        backgroundColor: "#343a40",
                      }}
                    >
                      <tr style={{ height: "55px" }}>
                        <th>Calle</th>
                        <th>N.Exterior</th>
                        <th>N.Interior</th>
                        <th>C.Postal</th>
                        <th>Colonia/Localidad</th>
                        <th>Delegación/Municipio</th>
                        <th>Estado</th>
                        <th>Clase</th>
                        <th>Orígen</th>
                        <th>Información</th>
                        <th>idDomicilio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableDomicilioData?.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => {
                            handleDomicilioSelection(item.códigoPostal || "");
                            handleUpdateAddressInformation(item);
                            handleDomicilioRowClick(item); // Llama a la función para cargar los datos en el formulario
                          }}
                          style={{ cursor: "pointer" }} // Agregado para igualar el estilo de la tabla Postal
                        >
                          <td>{renderCell(item.calle)}</td>
                          <td>{renderCell(item.númeroExterior)}</td>
                          <td>{renderCell(item.númeroInterior)}</td>
                          <td>{renderCell(item.códigoPostal)}</td>
                          <td>{renderCell(item.coloniaLocalidad)}</td>
                          <td>{renderCell(item.delegaciónMunicipio)}</td>
                          <td>{renderCell(item.estado)}</td>
                          <td>{renderCell(item.clase)}</td>
                          <td>{renderCell(item.orígen)}</td>
                          <td>{renderCell(item.información)}</td>
                          <td>{renderCell(item.idDomicilio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              <h4>Postal</h4>
              <div
                className="scroll-container"
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  overflowY: "auto",
                  display: "flex",
                  backgroundColor: "#343a40",
                  color: "#ffffff",
                  scrollbarColor: "#6c757d #343a40",
                  scrollbarWidth: "thin",
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  variant="dark"
                  style={{ fontSize: "13px" }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#343a40",
                    }}
                  >
                    <tr style={{ height: "55px" }}>
                      <th>Código Postal</th>
                      <th>Colonia</th>
                      <th>Municipio</th>
                      <th>Estado</th>
                      <th>Zona</th>
                      <th>Asentamiento</th>
                      <th>Periferia</th>
                      <th>Estancia</th>
                      <th>Sucursal</th>
                      <th>Zona de Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postalTableData?.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => handlePostalRowClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{renderCell(item.códigoPostal)}</td>
                        <td>{renderCell(item.colonia)}</td>
                        <td>{renderCell(item.municipio)}</td>
                        <td>{renderCell(item.estado)}</td>
                        <td>{renderCell(item.zona)}</td>
                        <td>{renderCell(item.asentamiento)}</td>
                        <td>{renderCell(item.periferia)}</td>
                        <td>{renderCell(item.estancia)}</td>
                        <td>{renderCell(item.sucursal)}</td>
                        <td>{renderCell(item.zonaRiesgo ? "Sí" : "No")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
            {/* Tablas a la izquierda */}

            {/* Formulario a la derecha */}
            <Col md={4} className="d-flex flex-column justify-content-start align-items-end">
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>C.Postal</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.codigoPostal || ""}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        setFormData({
                          ...formData,
                          codigoPostal: inputValue,
                        });
                        handleDomicilioSelection(inputValue);
                      }}
                      placeholder={
                        formData.codigoPostal || "Código postal"
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nú. Exterior</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.numExt}
                      onChange={(e) =>
                        setFormData({ ...formData, numExt: e.target.value })
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nú. Interior</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.numInt}
                      onChange={(e) =>
                        setFormData({ ...formData, numInt: e.target.value })
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Calle</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.calle}
                      onChange={(e) =>
                        setFormData({ ...formData, calle: e.target.value })
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Colonia / Localidad</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.colonia}
                      onChange={(e) =>
                        setFormData({ ...formData, colonia: e.target.value })
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
            
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Delegación / Municipio</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.municipio}
                      onChange={(e) =>
                        setFormData({ ...formData, municipio: e.target.value })
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Origen</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.origen}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData?.Fecha || ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="clase">
                    <Form.Label>Clase</Form.Label>
                    <Form.Select
                      value={clase}
                      onChange={(e) => setClase(e.target.value)}
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    >
                      <option value="">Selecciona una Clase</option>
                      <option value="1505">Hogar</option>
                      <option value="1509">Tercero</option>
                      <option value="1508">Familiar</option>
                      <option value="1501">Empresa</option>
                      <option value="1506">Oficina</option>
                      <option value="1519">Baja</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Información Actual</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        idInformacion === "1904"
                          ? "Errónea"
                          : idInformacion === "1902"
                          ? "Incompleta"
                          : idInformacion === "1903"
                          ? "No corresponde"
                          : idInformacion === "1905"
                          ? "Inexistente"
                          : idInformacion === "1906"
                          ? "Correcta"
                          : idInformacion || "Sin información" // Mantén la lógica actual si no coincide con las nuevas condiciones
                      }
                      disabled
                      placeholder="Sin información"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-4 w-100">
                <Col className="d-flex justify-content-start">
                  <Button
                    variant="success"
                    onClick={async () => {
                      if (!idInformacion) {
                        toast.error("Por favor, seleccione un valor para idInformacion.");
                        return;
                      }

                      const payload = {
                        idCartera: 1,
                        idCuenta: idCuenta,
                        idDomicilio: selectedDomicilio?.idDomicilio || 0,
                        idInformacion: parseInt(idInformacion, 10),
                        fecha:selectedDomicilio?.Fecha || "",
                      };

                      try {
                        setIsLoading(true);
                        const response = await servicio.post(
                          "/search-customer/update-address-information",
                          payload
                        );
                        toast.success("Información identificada exitosamente.");
                        console.log("Respuesta del servidor:", response.data);

                        // Deshabilitar el botón y el dropdown después de la identificación correcta
                        setIsEstadoVisible(false);
                        setIdInformacion(""); // Limpia el valor seleccionado

                        // Actualizar la tabla de domicilios
                        await fetchTableDomicilioData();
                      } catch (error) {
                        console.error("Error al identificar la información:", error);
                        toast.error("No se pudo identificar la información.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={!isEstadoVisible} // Deshabilitar si el dropdown no está visible
                  >
                    Identificar
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center">
                  <Form.Group controlId="idInformacion">
                    <Form.Select
                      value={idInformacion}
                      onChange={(e) => setIdInformacion(e.target.value)}
                      disabled={!isEstadoVisible} // Deshabilitar si el dropdown no está visible
                    >
                      <option value="">Seleccione una Información</option>
                      <option value="1904">Errónea</option>
                      <option value="1902">Incompleta</option>
                      <option value="1903">No corresponde</option>
                      <option value="1905">Inexistente</option>
                      <option value="1906">Correcta</option>
                      {/* Agregar más opciones según sea necesario */}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    onClick={async () => {
                      // Validar que todos los campos requeridos estén llenos
                      if (
                        !formData.calle ||
                        !formData.numExt ||
                        !formData.codigoPostal ||
                        !formData.colonia ||
                        !formData.municipio ||
                        !formData.estado 
                      ) {
                        toast.error("Por favor, complete todos los campos obligatorios.");
                        return;
                      }

                      // Si el campo Nu. Interior está vacío, asignar "0"
                      const numInt = formData.numInt || "0";

                      const idCuentaStr = String(idCuenta) || "string"; // Convierte a cadena
                      const idClaseInt = parseInt(clase, 10) || 0;

                      if (!idCuentaStr || idCuentaStr === "string") {
                        toast.error("El ID de cuenta no es válido.");
                        return;
                      }

                      if (idClaseInt === 0) {
                        toast.error("La clase no es válida.");
                        return;
                      }

                      const payload = {
                        idCartera: 1,
                        idCuenta: idCuenta,
                        idEjecutivo: parseInt(idEjecutivo, 10) || 0,
                        idProducto: 1,
                        calle: formData.calle || "string",
                        numeroExterior: formData.numExt || "string",
                        numeroInterior: numInt,
                        codigoPostal: formData.codigoPostal || "string",
                        colonia: formData.colonia || "string",
                        municipio: formData.municipio || "string",
                        estado: formData.estado || "string",
                        idClase: idClaseInt,
                        fecha: formData.fecha || "string",
                      };

                      console.log("Payload enviado:", payload);

                      try {
                        setIsLoading(true);
                        const response = await servicio.put(
                          "/search-customer/save-new-address",
                          payload
                        );
                        toast.success("Dirección guardada exitosamente.");
                        console.log("Respuesta del servidor:", response.data);

                        // Actualizar la tabla de domicilios después de guardar
                        await fetchTableDomicilioData();
                      } catch (error) {
                        if (error.response) {
                          console.error(
                            "Error del servidor:",
                            error.response.data
                          );
                          const validationErrors = error.response.data.errors;
                          if (validationErrors) {
                            Object.keys(validationErrors).forEach((field) => {
                              toast.error(
                                `${field}: ${validationErrors[field].join(
                                  ", "
                                )}`
                              );
                            });
                          } else {
                            toast.error(
                              `Error: ${
                                error.response.data.title ||
                                "Solicitud inválida"
                              }`
                            );
                          }
                        } else {
                          console.error(
                            "Error al guardar la dirección:",
                            error
                          );
                          toast.error("No se pudo guardar la dirección.");
                        }
                      } finally {
                        setIsLoading(false);
                        clearFormFields();
                      }
                    }}
                    disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                  >
                    Nuevo
                  </Button>
                </Col>
              </Row>
            </Col>
            {/* Formulario a la derecha */}
          </Row>
          {/* Tablepostal.jsx*/}

          {/*TableVisits.jsx*/}
          <h4>Visitas</h4>
          <div
            className="scroll-container"
            style={{
              width: "100%",
              maxHeight: "200px",
              overflowY: "auto",
              display: "flex",
              backgroundColor: "#343a40",
              color: "#ffffff",
              scrollbarColor: "#6c757d #343a40",
              scrollbarWidth: "thin",
            }}
          >
            <Table
              striped
              bordered
              hover
              responsive
              variant="dark"
              style={{ fontSize: "13px" }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#343a40",
                }}
              >
                <tr style={{ height: "55px" }}>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Contacto</th>
                  <th>Situación</th>
                  <th>Causa No Pago</th>
                  <th>Nombre</th>
                  <th>Parentesco</th>
                  <th>Sucursal</th>
                  <th>Color Fachada</th>
                  <th>Color Puerta</th>
                  <th>Color Herrería</th>
                  <th>Pisos</th>
                  <th>Vivienda</th>
                  <th>Habitación</th>
                  <th>Económico</th>
                  <th>NombrePropietario</th>
                  <th>AutoMapeo</th>
                  <th>AutoMarca</th>
                  <th>AutoAño</th>
                  <th>CalleHorizontalNorte</th>
                  <th>CalleHorizontalSur</th>
                  <th>CalleVerticalOeste</th>
                  <th>CalleVerticalEste</th>
                  <th>Visitador</th>
                  <th>Capturista</th>
                  <th>FechaPagoNegociación</th>
                  <th>MontoNegociación</th>
                </tr>
              </thead>
              <tbody>
                {tableDomData.map((item, index) => (
                  <tr key={index} onClick={() => handleRowClick(item)}>
                    <td>{renderCell(formatearFecha(item.Fecha))}</td>
                    <td>{renderCell(item.Hora)}</td>
                    <td>{renderCell(item.idContacto)}</td>
                    <td>{renderCell(item.idSituación)}</td>
                    <td>{renderCell(item.idCausaNoPago)}</td>
                    <td>{renderCell(item.NombreContacto)}</td>
                    <td>{renderCell(item.idParentesco)}</td>
                    <td>{renderCell(item.idSucursal)}</td>
                    <td>{renderCell(item.ColorFachada)}</td>
                    <td>{renderCell(item.ColorPuerta)}</td>
                    <td>{renderCell(item.ColorHerrería)}</td>
                    <td>{renderCell(item.Pisos)}</td>
                    <td>{renderCell(item.idVivienda)}</td>
                    <td>{renderCell(item.idHabitación)}</td>
                    <td>{renderCell(item.idEconómico)}</td>
                    <td>{renderCell(item.NombrePropietario)}</td>
                    <td>{renderCell(item.AutoMapeo)}</td>
                    <td>{renderCell(item.AutoMarca)}</td>
                    <td>{renderCell(item.AutoAño)}</td>
                    <td>{renderCell(item.CalleHorizontalNorte)}</td>
                    <td>{renderCell(item.CalleHorizontalSur)}</td>
                    <td>{renderCell(item.CalleVerticalOeste)}</td>
                    <td>{renderCell(item.CalleVerticalEste)}</td>
                    <td>{renderCell(item.Visitador)}</td>
                    <td>{renderCell(item.Capturista)}</td>
                    <td>{renderCell(item.FechaPagoNegociación)}</td>
                    <td>{renderCell(item.MontoNegociación)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Row>
            <div>
              <strong>Comentario: </strong>
              {selectedGestion && selectedGestion.Comentario
                ? renderCell(selectedGestion.Comentario)
                : "Seleccione una gestión para ver el comentario"}
            </div>
          </Row>
          {/*TableVisits.jsx */}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Addresses;