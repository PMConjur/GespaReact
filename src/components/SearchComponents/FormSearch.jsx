import { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import {
  fetchSaveExecutive,
  fetchSearchAddDate,
  getAditionalsData,
  fetchDropSources,
  fetchEmailsCharging
} from "../../services/gespawebServices";
import { AppContext } from "../../pages/Managment"; // Importa el contexto

const FormSearch = () => {
  const { searchResults, isDataAllPhones } = useContext(AppContext);
  const idCuenta = searchResults?.[0]?.idCuenta;
  const [datoOptions, setDatoOptions] = useState([]);
  const [datoSources, setDatoSources] = useState([]);
  const [tipoDatoOptions, setTipoDatoOptions] = useState([]); // Opciones para ddlTipoDato
  const [additionalOptions, setAdditionalOptions] = useState([]); // Opciones adicionales
  const [selectedValue, setSelectedValue] = useState("");
  const [isTipoDatoChanged, setIsTipoDatoChanged] = useState(false); // Estado para controlar el cambio

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
    if (value !== "Seleccionar..." && value !== "") {
      setIsTipoDatoChanged(false); // Marca que se realizó un cambio y activa animación de pulso
    }
  };

  useEffect(() => {
    loadDatoOptions(); // Carga las opciones iniciales
    loadDropSources(); // Carga las opciones iniciales de fuentes
  }, [idCuenta]);

  return (
    <>
      <div>
        <Row>
          <Col xs={12} md={12} lg={4}>
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-dark text-white">
                Dato
              </InputGroup.Text>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Select id="ddlDato" onChange={handleSelectChange}>
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
              <Form.Group as={Col} controlId="formGridState">
                {selectedValue === "2603" || selectedValue === "2604" ? (
                  <Form.Control
                    id="txtDato"
                    placeholder={
                      selectedValue === "2603"
                        ? "Nombre de la Empresa"
                        : "Ingresa Domicilio"
                    }
                    aria-label="Empresa"
                    aria-describedby="basic-addon1"//
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
              <Form.Group as={Col} controlId="formGridState">
                <Form.Select>
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
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Check type="switch" label="Encontrado" />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12} lg={4}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" placeholder="" />
          </Col>
          <Col xs={12} md={12} lg={4}>
            <Form.Label>Puesto</Form.Label>
            <Form.Control type="text" placeholder="" />
          </Col>

          <Col xs={12} md={12} lg={4}>
            <Form.Label>Lugar</Form.Label>
            <Form.Control type="text" placeholder="" value="" />
          </Col>

          <Col xs={12} md={12} lg={4}>
            <Form.Label>Link de la página</Form.Label>
            <Form.Control type="text" placeholder="" value="" />
          </Col>
          <Col xs={12} md={12} lg={4}>
            <Form.Label>Teléfonos</Form.Label>
            <Form.Control type="text" placeholder="" />
          </Col>
        </Row>

        <Form.Group className="mb-3 me-3">
          <div className="phone-number-list">
            <Button variant="danger" size="sm" className="remove-button">
              X
            </Button>
            <span id="addPhone">{}</span>
          </div>
        </Form.Group>

        <Row>
          <Col>
            <Button variant="primary" type="button">
              Guardar
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FormSearch;
