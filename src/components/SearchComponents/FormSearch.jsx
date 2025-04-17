import { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import {
  fetchSaveExecutive,
  fetchSearchAddDate
} from "../../services/gespawebServices";
import { AppContext } from "../../pages/Managment"; // Importa el contexto

const FormSearch = () => {
  const { searchResults } = useContext(AppContext);
  const idCuenta = searchResults?.[0]?.idCuenta;
  const [datoOptions, setDatoOptions] = useState([]);
  const [tipoDatoOptions, setTipoDatoOptions] = useState([]); // Opciones para ddlTipoDato
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
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

    loadDatoOptions();
  }, [idCuenta]); // Ejecuta el efecto solo cuando idCuenta cambia

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    // Llenar ddlTipoDato según el valor seleccionado
    switch (value) {
      case "2601": // Nombre
        setTipoDatoOptions([
          {
            id: searchResults?.[0]?.nombreDeudor,
            text: searchResults?.[0]?.nombreDeudor
          }
        ]);
        break;
      case "2602": // Teléfono
        setTipoDatoOptions([
          { id: "1", text: "Celular" },
          { id: "2", text: "Casa" },
          { id: "3", text: "Trabajo" }
        ]);
        break;
      case "2603": // Empresa
        setTipoDatoOptions([
          { id: "1", text: "Nombre de la Empresa" },
          { id: "2", text: "Giro" },
          { id: "3", text: "Tamaño" }
        ]);
        break;
      case "2604": // Domicilio
        setTipoDatoOptions([{ id: "", text: "" }]);
        break;
      case "2605": // Adicional
        setTipoDatoOptions([
          { id: "1", text: "Referencia Personal" },
          { id: "2", text: "Referencia Laboral" }
        ]);
        break;
      case "2606": // Correo
        setTipoDatoOptions([
          { id: "1", text: "Correo Personal" },
          { id: "2", text: "Correo Laboral" }
        ]);
        break;
      case "2607": // RFC
        setTipoDatoOptions([
          {
            id: searchResults?.[0]?.rfc,
            text: searchResults?.[0]?.rfc
          }
        ]);
        break;
      default:
        setTipoDatoOptions([]); // Vaciar opciones si no hay coincidencia
        break;
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
                <Form.Select id="ddlTipoDato">
                  <option value="">Seleccionar...</option>
                  {tipoDatoOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.text}
                    </option>
                  ))}
                </Form.Select>
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
