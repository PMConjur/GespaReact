import { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Table, Spinner, Dropdown } from "react-bootstrap";
import {
  fetchActionsSearch,
  fetchSaveExecutive,
  fetchSearchAddDate
} from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";
import { toast } from "sonner";

const Search = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext);
  const [searchData, setSearchData] = useState({
    dato: "",
    fuente: "",
    encontrado: false,
    nombre: "",
    puesto: "",
    telefonos: "",
    lugar: "",
    link: ""
  });
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [valorOptions, setValorOptions] = useState([]);
  const [fuenteOptions, setFuenteOptions] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const datosUnicos = [...new Set(tableData.map((item) => item.Dato))];
  const valoresUnicos = [...new Set(tableData.map((item) => item.DatoBuscado))];

  useEffect(() => {
    if (show && searchResults && searchResults.length > 0) {
      fetchData(searchResults[0].idCuenta.trim());
    }
  }, [show, searchResults]);

  useEffect(() => {
    const isValid =
      searchData.dato &&
      searchData.fuente &&
      searchData.nombre &&
      searchData.puesto &&
      phoneNumbers.length > 0 &&
      searchData.lugar &&
      searchData.link;
    setIsFormValid(isValid);
  }, [searchData, phoneNumbers]);

  useEffect(() => {
    setShowForm(searchData.encontrado);
  }, [searchData.encontrado]);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        console.log("Llamando a fetchSearchAddDate");
        const result = await fetchSearchAddDate();
        console.log("Datos recibidos de fetchSearchAddDate:", result);

        if (Array.isArray(result)) {
          const mappedDatos = result.map((item) => ({
            id: item.idValor,
            descripcion: item.Valor
          }));
          setValorOptions(mappedDatos);
        } else {
          throw new Error("La respuesta del endpoint no es un array.");
        }
      } catch (error) {
        toast.error("Error al cargar los datos del dropdown.");
        console.error("Error al cargar los datos del dropdown:", error);
      }
    };

    fetchSearchData();
  }, []);

  const fetchData = async (idCuenta) => {
    setLoading(true);
    try {
      const response = await fetchActionsSearch(idCuenta);
      console.log("Respuesta de fetchActionsSearch:", response);
      const mappedData = mapResponseToTableData(response);
      setTableData(mappedData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      toast.error("Hubo un error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const mapResponseToTableData = (response) => {
    return response.map((item) => ({
      Fecha: item.Fecha_Insert || "--",
      Hora: item.Segundo_Insert || "--",
      Ejecutivo: item.Ejecutivo || "--",
      Dato: item.Dato || "--",
      DatoBuscado: item.DatoBuscado || "--",
      Fuente: item.Fuente || "--",
      Encontrado: item._Encontrado === "✓" ? "Sí" : "No",
      Telefonos: item.Teléfonos || "--",
      Persona:
        typeof item.Persona === "string" && item.Persona.trim() !== ""
          ? item.Persona
          : "--",
      Puesto:
        typeof item.Puesto === "string" && item.Puesto.trim() !== ""
          ? item.Puesto
          : "--",
      Lugar:
        typeof item.Lugar === "string" && item.Lugar.trim() !== ""
          ? item.Lugar
          : "--",
      idEjecutivo: item.idEjecutivo || "--",
      InfoEncontrada:
        item.InfoEncontrada && Object.keys(item.InfoEncontrada).length > 0
          ? JSON.stringify(item.InfoEncontrada)
          : "--",
      Confirmado: item._Confirmado === "✓" ? "Sí" : "No",
      Link:
        typeof item.Link === "string" && item.Link.trim() !== ""
          ? item.Link
          : "--",
      idDato: item.idDato || "--"
    }));
  };

  const FormatInfo = ({ info }) => {
    if (!info || info === "--") return "--";

    try {
      const parsedInfo = typeof info === "string" ? JSON.parse(info) : info;
      if (Object.keys(parsedInfo).length === 0) return "--";

      return (
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {Object.entries(parsedInfo).map(([key, value]) => (
            <li key={key}>{`${key}: ${value}`}</li>
          ))}
        </ul>
      );
    } catch {
      return "--";
    }
  };

  const limpiarFormulario = () => {
    setSearchData({
      dato: "",
      fuente: "",
      encontrado: false,
      nombre: "",
      puesto: "",
      telefonos: "",
      lugar: "",
      link: ""
    });
    setPhoneNumbers([]);
    setShowForm(false);
  };

  const handleCloseModal = () => {
    limpiarFormulario();
    handleClose();
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSearchData((prev) => ({
      ...prev,
      encontrado: checked
    }));
  };

  const handleChange = (name, value) => {
    if (
      name === "nombre" ||
      name === "puesto" ||
      name === "lugar" ||
      name === "link"
    ) {
      setSearchData((prev) => ({
        ...prev,
        [name]: value
      }));
    } else if (name === "telefonos") {
      const regex = /^[0-9\s]+$/;
      if (value === "" || (regex.test(value) && value.length <= 10)) {
        setSearchData((prev) => ({
          ...prev,
          [name]: value
        }));
        if (value.length === 10) {
          setPhoneNumbers((prev) => [...prev, value]);
          setSearchData((prev) => ({
            ...prev,
            telefonos: ""
          }));
        }
      }
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value
      }));
      if (name === "dato") {
        const filteredValues = tableData
          .filter((item) => item.Dato === value)
          .map((item) => item.DatoBuscado);
        setValorOptions([...new Set(filteredValues)]);
      }
    }
  };

  const handleRemovePhoneNumber = (index) => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardarClick = async () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false
    });
    const currentDate = new Date().toISOString();
    try {
      const idCuenta = searchResults[0].idCuenta.trim();
      const idEjecutivo = searchResults[0].idEjecutivo;
      const requestData = {
        idCartera: 1,
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        idDato: Number(searchData.dato),
        idFuente: Number(searchData.fuente),
        dato: searchData.dato,
        encontrado: searchData.encontrado,
        telefonos: phoneNumbers.map((númeroTelefónico) => ({
          númeroTelefónico
        })),
        persona: searchData.nombre,
        puesto: searchData.puesto,
        lugar: searchData.lugar,
        link: searchData.link,
        validador: 0,
        fecha_Insert: currentDate,
        segundo_Insert: currentTime
      };
      const response = await fetchSaveExecutive(requestData);
      toast.success("Datos guardados correctamente.");
      limpiarFormulario();
      fetchData(idCuenta);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("Hubo un error al guardar los datos.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCloseModal} backdrop="static" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Búsquedas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="scroll-container">
            <Form>
              <div className="form-group-container">
                <Form.Group className="mb-3">
                  <Form.Label>Dato</Form.Label>
                  <Dropdown onSelect={(value) => handleChange("dato", value)}>
                    <Dropdown.Toggle variant="primary" id="dropdown-dato">
                      {searchData.dato.nombre || "Seleccionar"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {valorOptions.map((dato, index) => (
                        <Dropdown.Item
                          key={index}
                          eventKey={dato.id}
                          id={dato.id}
                        >
                          {dato.descripcion}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Dropdown onSelect={(value) => handleChange("valor", value)}>
                    <Dropdown.Toggle variant="primary" id="dropdown-valor">
                      {searchData.valor || "Seleccionar"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {valoresUnicos.map((valor, index) => (
                        <Dropdown.Item key={index} eventKey={valor}>
                          {valor}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </div>
              <div className="form-group-container">
                <Form.Group className="mb-3">
                  <Form.Label>Fuente</Form.Label>
                  <Dropdown onSelect={(value) => handleChange("fuente", value)}>
                    <Dropdown.Toggle variant="primary" id="dropdown-fuente">
                      {searchData.fuente || "Seleccionar"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {fuenteOptions.map((fuente, index) => (
                        <Dropdown.Item key={index} eventKey={fuente}>
                          {fuente}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Check
                  type="switch"
                  label="Encontrado"
                  checked={searchData.encontrado}
                  onChange={handleCheckboxChange}
                />
              </div>
              {showForm && (
                <Form.Group className="mb-3 me-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={searchData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.stopPropagation();
                      }
                    }}
                  />
                  <Form.Label>Puesto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={searchData.puesto}
                    onChange={(e) => handleChange("puesto", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.stopPropagation();
                      }
                    }}
                  />
                  <Form.Label>Teléfonos</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={searchData.telefonos}
                    onChange={(e) => handleChange("telefonos", e.target.value)}
                  />
                  <div>
                    {phoneNumbers.map((phone, index) => (
                      <div key={index} className="phone-number-list">
                        <Button
                          variant="danger"
                          size="sm"
                          className="remove-button"
                          onClick={() => handleRemovePhoneNumber(index)}
                        >
                          X
                        </Button>
                        <span>{phone}</span>
                      </div>
                    ))}
                  </div>
                  <Form.Label>Lugar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={searchData.lugar}
                    onChange={(e) => handleChange("lugar", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.stopPropagation();
                      }
                    }}
                  />
                  <Form.Label>Link de la página</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={searchData.link}
                    onChange={(e) => handleChange("link", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.stopPropagation();
                      }
                    }}
                  />
                </Form.Group>
              )}
            </Form>
            <div style={{ marginTop: "auto" }}>
              <Button
                variant="primary"
                type="button"
                onClick={handleGuardarClick}
                style={{ marginBottom: "10px" }}
                disabled={!isFormValid}
              >
                Guardar
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <div className="table-container">
              <Table striped bordered hover variant="dark" className="mt-3">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Ejecutivo</th>
                    <th>Dato</th>
                    <th>Dato Buscado</th>
                    <th>Fuente</th>
                    <th>Encontrado</th>
                    <th>Teléfonos</th>
                    <th>Persona</th>
                    <th>Puesto</th>
                    <th>Lugar</th>
                    <th>idEjecutivo</th>
                    <th>Info Encontrada</th>
                    <th>Confirmado</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Fecha}</td>
                      <td>{item.Hora}</td>
                      <td>{item.Ejecutivo}</td>
                      <td>{item.Dato}</td>
                      <td>{item.DatoBuscado}</td>
                      <td>{item.Fuente}</td>
                      <td>{item.Encontrado}</td>
                      <td>{item.Telefonos}</td>
                      <td>{item.Persona}</td>
                      <td>{item.Puesto}</td>
                      <td>{item.Lugar}</td>
                      <td>{item.idEjecutivo}</td>
                      <td>
                        {item.InfoEncontrada !== "--" ? (
                          <ul style={{ margin: 0, paddingLeft: "20px" }}>
                            {Object.entries(
                              JSON.parse(item.InfoEncontrada)
                            ).map(([key, value]) => (
                              <li key={key}>{`${key}: ${value}`}</li>
                            ))}
                          </ul>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td>{item.Confirmado}</td>
                      <td>{item.Link}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <style jsx>{`
        .modal-body {
          max-height: 70vh;
          overflow-y: auto;
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
        .scroll-container {
          width: 100%;
          max-height: 70vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .form-section {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .form-group-container {
          display: flex;
          justify-content: space-between;
          margin-right: 20px;
        }
        .phone-number-list {
          display: flex;
          align-items: center;
          margin-top: 3px;
          margin-bottom: 3px;
        }
        .phone-number-list span {
          margin-left: 10px;
        }
        .remove-button {
          padding: 0 5px !important;
        }
        .table-container {
          overflow: auto;
          max-height: 70vh;
          max-width: 800px;
          min-width: 250px;
        }
      `}</style>
    </>
  );
};

export default Search;
