import { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button, Form, InputGroup, Col, Row, Stack } from "react-bootstrap";
import {
  fetchSaveExecutive,
  fetchSearchAddDate,
  getAditionalsData,
  fetchDropSources,
  fetchEmailsCharging
} from "../../services/gespawebServices";
import { AppContext } from "../../pages/Managment"; // Importa el contexto

const FormSearch = () => {
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));
  const { searchResults, isDataAllPhones, stoppedTimeSticky } =
    useContext(AppContext);
  const idCuenta = searchResults?.[0]?.idCuenta;
  const [datoOptions, setDatoOptions] = useState([]);
  const [datoSources, setDatoSources] = useState([]);
  const [tipoDatoOptions, setTipoDatoOptions] = useState([]); // Opciones para ddlTipoDato
  const [additionalOptions, setAdditionalOptions] = useState([]); // Opciones adicionales
  const [selectedValue, setSelectedValue] = useState("");
  const [isTipoDatoChanged, setIsTipoDatoChanged] = useState(false); // Estado para controlar el cambio
  const [isSwitchOn, setIsSwitchOn] = useState(false); // Estado para el interruptor
  const [telephone, setTelephone] = useState("");
  const [isTelephoneValid, setIsTelephoneValid] = useState(false);
  const [phoneList, setPhoneList] = useState([]); // Lista de teléfonos agregados
  const [phoneData, setPhoneData] = useState(new Set()); // Conjunto para almacenar los datos de phoneList
  const [link, setLink] = useState(""); // Estado para el enlace
  const [isLinkValid, setIsLinkValid] = useState(false); // Estado para la validación del enlace

  const [searchData, setSearchData] = useState({
    nombre: "",
    puesto: "",
    lugar: ""
  }); // Estado para los datos de búsqueda
  //console.log("telefonos", phoneData);
  const loadDatoOptions = async () => {
    if (!idCuenta) return; // Solo ejecuta si idCuenta no es vacío
    try {
      const response = await fetchSearchAddDate(idCuenta); // Pasa idCuenta como parámetro
      setDatoOptions(response);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error al cargar los datos del dropdown.");
    }
  };

  const loadDropSources = async () => {
    if (!idCuenta) return; // Solo ejecuta si idCuenta no es vacío
    try {
      const response = await fetchDropSources(); // Pasa idCuenta como parámetro
      setDatoSources(response);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error al cargar los datos del dropdown.");
    }
  };

  const handleSelectChange = async (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    // Limpieza completa de datos antes de procesar la nueva selección
    setAdditionalOptions([]); // Limpia las opciones adicionales
    setTipoDatoOptions([]); // Limpia las opciones de tipo de dato
    setIsTipoDatoChanged(false);

    const additionalData = await loadAdditionalOptions();
    const isAdditional = additionalData ? additionalData : null; // Asigna adicionales si existen en caso de que no este limpia para no mantener las opciones en el drop
    const emailsData = await loadEmailOptions();
    const isEmail = emailsData ? emailsData : null; // Asigna correos si existen en caso de que no este limpia para no mantener las opciones en el drop
    setSearchData((prevData) => ({
      ...prevData,
      ddlDato: value // Asigna el valor seleccionado a searchData.ddlDato
    }));
    searchData.txtDato = ""; // Asigna el valor al estado
    // Llenar ddlTipoDato según el valor seleccionado
    switch (value) {
      case "2601": // Nombre
        {
          setIsTipoDatoChanged(true);
          setTipoDatoOptions([
            {
              id: searchResults?.[0]?.nombreDeudor,
              text: searchResults?.[0]?.nombreDeudor
            }
          ]);
        }
        break;
      case "2602": // Teléfono
        {
          setIsTipoDatoChanged(true);
          setTipoDatoOptions(
            isDataAllPhones.map((phone) => ({
              id: phone.númeroTelefónico,
              text: `XXX-XXX-${phone.númeroTelefónico.slice(-4)}`
            }))
          );
        }
        break;
      case "2603": // Empresa
        {
          setIsTipoDatoChanged(true);
          setTipoDatoOptions([
            { id: "1", text: "Nombre de la Empresa" },
            { id: "2", text: "Giro" },
            { id: "3", text: "Tamaño" }
          ]);
        }
        break;
      case "2604": // Domicilio
        {
          setTipoDatoOptions([{ id: "", text: "" }]);
        }
        break;
      case "2605": // Adicional
        {
          try {
            setIsTipoDatoChanged(true);
            setTipoDatoOptions(isAdditional); // Asigna las opciones adicionales
          } catch (error) {
            console.error("Error al cargar los datos adicionales:", error);
            toast.error("Error al cargar los datos adicionales.");
          }
        }
        break;
      case "2606": // Correo
        {
          setIsTipoDatoChanged(true);
          setTipoDatoOptions(isEmail);
        }
        break;
      case "2607": // RFC
        {
          setIsTipoDatoChanged(true);
          setTipoDatoOptions([
            {
              id: searchResults?.[0]?.rfc,
              text: searchResults?.[0]?.rfc
            }
          ]);
        }
        break;
      default:
        {
          setIsTipoDatoChanged(false);
          setTipoDatoOptions([]);
          setAdditionalOptions([]); // Limpia las opciones adicionales en el caso por defecto
        }
        break;
    }
  };

  const loadAdditionalOptions = async () => {
    if (!idCuenta && selectedValue === "2605") return []; // Solo ejecuta si idCuenta no es vacío
    try {
      const response = await getAditionalsData(1, idCuenta); // Pasa idCuenta como parámetro
      return response.map((option) => ({
        id: option.idParentesco,
        text: option.NombreAdicional
      }));
    } catch (error) {
      console.error("Error al cargar los datos adicionales:", error);
      throw error; // Lanza el error para manejarlo en el caso "2605"
    }
  };

  const loadEmailOptions = async () => {
    if (!idCuenta && selectedValue === "2606") return []; // Solo ejecuta si idCuenta no es vacío
    try {
      const response = await fetchEmailsCharging(1, idCuenta); // Pasa idCuenta como parámetro
      return response.map((option) => ({
        id: option.idOrigen,
        text: option.CorreoElectrónico
      }));
    } catch (error) {
      console.error("Error al cargar los datos adicionales:", error);
      throw error; // Lanza el error para manejarlo en el caso "2605"
    }
  };
  const handleTipoDatoChange = (e) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text; // Obtiene el texto del elemento seleccionado
    if (value !== "Seleccionar..." && value !== "") {
      setIsTipoDatoChanged(false); // Marca que se realizó un cambio y activa animación de pulso
      setSearchData((prevData) => ({
        ...prevData,
        txtDato: text // Asigna el valor seleccionado a searchData.txtDato
      }));
    }
  };

  const handleFuenteChange = (e) => {
    const value = e.target.value;
    if (value !== "Seleccionar..." && value !== "") {
      setSearchData((prevData) => ({
        ...prevData,
        ddlFuente: value // Asigna el valor seleccionado a searchData.ddlFuente
      }));
    }
  };

  useEffect(() => {
    loadDatoOptions(); // Carga las opciones iniciales
    loadDropSources(); // Carga las opciones iniciales de fuentes
  }, [idCuenta]);

  const handleSwitchChange = (e) => {
    setIsSwitchOn(e.target.checked); // Actualiza el estado del interruptor inmediatamente
  };

  const handleTelephoneChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]{0,13}$/; // Permite solo números de hasta 13 dígitos
    setTelephone(value);
    setIsTelephoneValid(value.length === 10 && regex.test(value));
  };

  const handleAddPhone = () => {
    if (telephone.length === 10) {
      if (phoneData.has(telephone)) {
        toast.warning("El teléfono ya existe en la lista."); // Muestra un mensaje de error si el teléfono ya existe
        return;
      }

      setPhoneList([...phoneList, telephone]); // Agrega el teléfono a la lista
      setPhoneData((prevData) => new Set([...prevData, telephone])); // Agrega el teléfono al conjunto
      setTelephone(""); // Limpia el campo de entrada
      setIsTelephoneValid(false); // Resetea la validación
    }
  };

  const handleRemovePhone = (index) => {
    const phoneToRemove = phoneList[index]; // Obtiene el teléfono a eliminar
    const updatedList = phoneList.filter((_, i) => i !== index); // Elimina el teléfono por índice
    setPhoneList(updatedList);

    setPhoneData((prevData) => {
      const updatedData = new Set(prevData);
      updatedData.delete(phoneToRemove); // Elimina el teléfono del conjunto
      return updatedData;
    });

    toast.success("Teléfono eliminado.");
  };

  const resetFormData = () => {
    setSearchData({
      nombre: "",
      puesto: "",
      lugar: "",
      ddlDato: "",
      ddlFuente: "",
      txtDato: ""
    });
    setPhoneList([]); // Limpia la lista de teléfonos
    setPhoneData(new Set()); // Limpia el conjunto de teléfonos
    setTelephone(""); // Limpia el campo de teléfono
    setLink(""); // Limpia el enlace
    setIsSwitchOn(false); // Resetea el interruptor
  };

  const handleGuardarClick = async () => {
    try {
      const idCuenta = searchResults[0]?.idCuenta?.trim();
      const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
      const tiempoEnCuenta = stoppedTimeSticky || "00:00:00"; // Usa el tiempo capturado por TimmerAccount
      if (!idCuenta || !idEjecutivo) {
        toast.error("Faltan datos necesarios para guardar.");
        return;
      }

      const requestData = {
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        idCartera: 1,
        dato: searchData.txtDato,
        idDato: Number(searchData.ddlDato),
        idFuente: Number(searchData.ddlFuente),
        encontrado: isSwitchOn,
        numeroTelefonosEncontrados: phoneData ? phoneData : 0, // Usa el conjunto de teléfonos
        nombrePersona: searchData.nombre ? searchData.nombre : null,
        puesto: searchData.puesto ? searchData.puesto : null,
        nombreLugar: searchData.lugar ? searchData.lugar : null,
        domicilioLugar: null,
        tiempoEnCuenta: tiempoEnCuenta,
        link: link ? link : null,
        validador: "18967"
      };
      console.log("requestData", requestData);
      await fetchSaveExecutive(requestData);
      toast.success("Datos guardados correctamente.");
      setPhoneList([]); // Limpia la lista de teléfonos
      setSearchData({}); // Limpia los datos del formulario
      resetFormData(); // Limpia los datos del formulario
      setSelectedValue(""); // Limpia el valor seleccionado
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("Hubo un error al guardar los datos.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Permite letras, espacios y caracteres acentuados

    if (regex.test(value)) {
      setSearchData((prevData) => ({
        ...prevData,
        [id]: value // Asigna el valor al campo correspondiente (nombre, puesto o lugar)
      }));
      toast.dismiss(); // Elimina cualquier mensaje de advertencia previo
    } else {
      toast.warning(
        "Solo se permiten letras, espacios y caracteres válidos en este campo."
      ); // Muestra un mensaje de advertencia
    }
  };

  const handleInputChangeTxtDato = (e) => {
    const { value } = e.target;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Permite letras, espacios y caracteres acentuados

    if (regex.test(value)) {
      setSearchData((prevData) => ({
        ...prevData,
        txtDato: value // Asigna el texto ingresado a txtDato
      }));
      toast.dismiss(); // Elimina cualquier mensaje de advertencia previo
    } else {
      toast.warning(
        "Solo se permiten letras, espacios y caracteres válidos en este campo."
      ); // Muestra un mensaje de advertencia
    }
  };

  return (
    <>
      <div>
        <Row>
          <Col xs={12} md={12} lg={4}>
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-dark text-white">
                Dato
              </InputGroup.Text>
              <Form.Group as={Col}>
                <Form.Select
                  id="ddlDato"
                  onChange={handleSelectChange}
                  value={searchData.ddlDato || ""} // Vincula el valor al estado actualizado
                >
                  <option value="">Seleccionar...</option>
                  {datoOptions.map((option) => (
                    <option key={option.idValor} value={option.idValor}>
                      {option.Valor}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </InputGroup>
          </Col>
          <Col xs={12} md={12} lg={4}>
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-dark text-white">
                <span>-</span>
              </InputGroup.Text>
              <Form.Group as={Col}>
                {selectedValue === "2603" || selectedValue === "2604" ? (
                  <Form.Control
                    id="txtDato"
                    placeholder={
                      selectedValue === "2603"
                        ? "Nombre de la Empresa"
                        : "Ingresa Domicilio"
                    }
                    aria-label="Empresa"
                    aria-describedby="basic-addon1" //
                    onChange={handleInputChangeTxtDato} // Maneja el cambio
                    onKeyDown={(e) => e.key === " " && e.stopPropagation()}
                  />
                ) : (
                  <Form.Select
                    id="ddlTipoDato"
                    className={isTipoDatoChanged === true ? "pulse-search" : ""}
                    onChange={handleTipoDatoChange}
                  >
                    <option value="">Seleccionar...</option>
                    {tipoDatoOptions.map((option, index) => (
                      <option key={`${option.id}-${index}`} value={option.id}>
                        {option.text}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </InputGroup>
          </Col>
          <Col xs={12} md={12} lg={4}>
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-dark text-white">
                Fuente
              </InputGroup.Text>
              <Form.Group as={Col}>
                <Form.Select onChange={handleFuenteChange} id="ddlFuente">
                  <option value="">Seleccionar...</option>
                  {datoSources.map((option) => (
                    <option key={option.idValor} value={option.idValor}>
                      {option.Valor}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </InputGroup>
          </Col>
        </Row>

        {isSwitchOn && (
          <div id="additionalFound">
            <Row>
              <Col xs={12} md={4} lg={4}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  onKeyDown={(e) => e.key === " " && e.stopPropagation()}
                  id="nombre"
                  type="text"
                  placeholder="Ingresa el nombre"
                  value={searchData.nombre || ""} // Vincula el valor al estado
                  onChange={handleInputChange} // Maneja el cambio
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <Form.Label>Puesto</Form.Label>
                <Form.Control
                  onKeyDown={(e) => e.key === " " && e.stopPropagation()}
                  id="puesto"
                  type="text"
                  placeholder="Ingresa el puesto"
                  value={searchData.puesto || ""} // Vincula el valor al estado
                  onChange={handleInputChange} // Maneja el cambio
                />
              </Col>

              <Col xs={12} md={4} lg={4}>
                <Form.Label>Lugar</Form.Label>
                <Form.Control
                  onKeyDown={(e) => e.key === " " && e.stopPropagation()}
                  id="lugar"
                  type="text"
                  placeholder="Ingresa el lugar"
                  value={searchData.lugar || ""} // Vincula el valor al estado
                  onChange={handleInputChange} // Maneja el cambio
                />
              </Col>
              <br />
              <Col xs={12} md={4} lg={4}>
                <Form.Label>Link de la página</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa un enlace válido"
                  value={link}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLink(value);
                    const regex =
                      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[^\s]*)?$/i; // Verifica si es un enlace válido
                    setIsLinkValid(regex.test(value));
                  }}
                  isInvalid={!isLinkValid && link.length > 0} // Marca como inválido si no cumple
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingresa un enlace válido.
                </Form.Control.Feedback>
              </Col>

              <Col xs={12} md={4} lg={4}>
                <Form.Label>Teléfonos</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el teléfono"
                    id="frmTelephone"
                    required
                    maxLength={10}
                    value={telephone}
                    onChange={handleTelephoneChange}
                    isInvalid={!isTelephoneValid && telephone.length > 0} // Marca como inválido si no cumple
                  />
                  <Form.Control.Feedback type="invalid">
                    El teléfono debe contener 10 dígitos.
                  </Form.Control.Feedback>
                  <Button
                    variant="success  "
                    onClick={handleAddPhone}
                    disabled={telephone.length !== 10} // Solo habilita si tiene 10 dígitos
                  >
                    Agregar
                  </Button>
                </InputGroup>
              </Col>

              <Col xs={12} md={4} lg={4}>
                <span className="text-success">Agregados:</span>
                <br />

                <div className="scroll-add-phones">
                  <Stack direction="horizontal" gap={3} className="flex-wrap">
                    {phoneList.map((phone, index) => (
                      <>
                        <div style={{ flex: "calc(50% - 1rem)" }}>
                          <InputGroup className="p-2" key={index}>
                            {" "}
                            {/* Cada item ocupa el 50% del ancho */}
                            <InputGroup.Text className="phone-added border border-0">
                              {phone}
                            </InputGroup.Text>
                            <Button
                              variant="danger"
                              onClick={() => handleRemovePhone(index)}
                            >
                              X
                            </Button>
                          </InputGroup>
                        </div>
                      </>
                    ))}
                  </Stack>
                </div>
              </Col>
            </Row>
          </div>
        )}
        <br />
        <Row>
          <Col xs={12} md={6} lg={6}>
            <Form>
              <Form.Check
                type="switch"
                label="Encontrado"
                id="swtFound"
                checked={isSwitchOn}
                onChange={handleSwitchChange}
              />
            </Form>
          </Col>
          <Col xs={12} md={6} lg={6} className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="button"
              onClick={handleGuardarClick}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FormSearch;
