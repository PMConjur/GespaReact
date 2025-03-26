import { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Table, Spinner, Dropdown } from 'react-bootstrap';
import { fetchActionsSearch, fetchSaveExecutive } from '../../../services/gespawebServices';
import { AppContext } from "../../../pages/Managment";
import "../../../scss/styles.scss"
import { toast } from "sonner";

const Search = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext);

  const [searchData, setSearchData] = useState({
    dato: '2601', // Valor inicial del dropdown "Dato"
    fuente: '', // Valor inicial del dropdown "Fuente"
    encontrado: false, // Estado inicial del checkbox
    nombre: '',
    puesto: '',
    telefonos: '',
    lugar: '',
    link: ''
  });

  const [phoneNumbers, setPhoneNumbers] = useState([]); // Estado para la lista de números de teléfono
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [valorOptions, setValorOptions] = useState([]); // Estado para las opciones del dropdown "Valor"
  const [fuenteOptions, setFuenteOptions] = useState([]); // Estado para las opciones del dropdown "Fuente"
  const [isFormValid, setIsFormValid] = useState(false); // Estado para la validez del formulario

  // Extraer valores únicos de la columna "Dato" para el dropdown
  const datosUnicos = [...new Set(tableData.map((item) => item.Dato))];

  useEffect(() => {
    if (show && searchResults && searchResults.length > 0) {
      fetchData(searchResults[0].idCuenta.trim());
    }
  }, [show, searchResults]);

  useEffect(() => {
    // Verificar si todos los campos requeridos están llenos
    const isValid = searchData.dato && searchData.fuente && searchData.nombre && searchData.puesto && phoneNumbers.length > 0 && searchData.lugar && searchData.link;
    setIsFormValid(isValid);
  }, [searchData, phoneNumbers]);

  const fetchData = async (idCuenta) => {
    setLoading(true);
    try {
      const response = await fetchActionsSearch(idCuenta);
      console.log("Respuesta de la API:", response); // Verifica la respuesta de la API
      const mappedData = mapResponseToTableData(response);
      setTableData(mappedData);
      console.log("Datos cargados:", mappedData); // Verifica que los datos se carguen correctamente
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      alert("Hubo un error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const mapResponseToTableData = (response) => {
    return response.map((item) => ({
      Fecha: item.Fecha_Insert,
      Hora: item.Segundo_Insert,
      Ejecutivo: item.Ejecutivo,
      Dato: item.idDato, // Asegúrate de que este campo coincida con la respuesta de la API
      DatoBuscado: item.DatoBuscado, // Asegúrate de que este campo coincida con la respuesta de la API
      idFuente: item.idFuente,
      Encontrado: item._Encontrado,
      Telefonos: item.Teléfonos,
      Persona: Object.keys(item.Persona).length ? JSON.stringify(item.Persona) : '--',
      Puesto: Object.keys(item.Puesto).length ? JSON.stringify(item.Puesto) : '--',
      Lugar: Object.keys(item.Lugar).length ? JSON.stringify(item.Lugar) : '--',
      idEjecutivo: item.idEjecutivo,
      InfoEncontrada: Object.keys(item.InfoEncontrada).length ? JSON.stringify(item.InfoEncontrada) : '--',
      Confirmado: item._Confirmado,
      Link: item.Link || '--',
    }));
  };

  const handleChange = (name, value) => {
    if (name === 'telefonos') {
      // Validar que solo acepte números y un máximo de 10 dígitos
      const regex = /^[0-9\b]+$/;
      if (value === '' || (regex.test(value) && value.length <= 10)) {
        setSearchData((prev) => ({
          ...prev,
          [name]: value,
        }));
  
        // Agregar número de teléfono a la lista cuando se ingresen 10 dígitos
        if (value.length === 10) {
          setPhoneNumbers((prev) => [...prev, value]);
          setSearchData((prev) => ({
            ...prev,
            telefonos: '', // Limpiar el campo de entrada
          }));
        }
      }
    } else if (name === 'nombre' || name === 'puesto' || name === 'lugar') {
      // Permitir letras, números, espacios y otros caracteres comunes
      setSearchData((prev) => ({
        ...prev,
        [name]: value, // Actualizar el estado directamente
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value,
      }));
  
      // Mostrar/ocultar el formulario cuando se marca/desmarca el checkbox
      if (name === 'encontrado') {
        setShowForm(value);
      }
  
      // Filtrar los valores de "DatoBuscado" y "idFuente" cuando se cambia el dropdown "Dato"
      if (name === 'dato') {
        const selectedValue = Number(value);
        const filteredValues = tableData
          .filter((item) => item.Dato === selectedValue)
          .map((item) => item.DatoBuscado);
        setValorOptions([...new Set(filteredValues)]);
  
        const filteredFuentes = tableData
          .filter((item) => item.Dato === selectedValue)
          .map((item) => item.idFuente);
        setFuenteOptions([...new Set(filteredFuentes)]);
      }
    }
  };

  const handleRemovePhoneNumber = (index) => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardarClick = async () => {
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const currentDate = new Date().toISOString();

    try {
      const idCuenta = searchResults[0].idCuenta.trim();
      const idEjecutivo = searchResults[0].idEjecutivo; // Ajusta según sea necesario
      const requestData = {
        idCartera: 1, // Ajusta según sea necesario
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        idDato: Number(searchData.dato),
        idFuente: Number(searchData.fuente),
        dato: searchData.dato,
        encontrado: searchData.encontrado,
        teléfonos: phoneNumbers.map((numeroTelefónico) => ({ númeroTelefónico: numeroTelefónico })), // Usar la lista de números de teléfono
        persona: searchData.nombre,
        puesto: searchData.puesto,
        lugar: searchData.lugar,
        link: searchData.link,
        validador: 0, // Ajusta según sea necesario
        fecha_Insert: currentDate,
        segundo_Insert: currentTime
      };
      console.log("Datos a enviar:", requestData);
      const response = await fetchSaveExecutive(requestData);
      console.log("Respuesta del servidor:", response);
      toast.success("Datos guardados correctamente."); // Mostrar notificación de éxito
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      toast.error("Hubo un error al guardar los datos."); // Mostrar notificación de error
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" >
      <Modal.Header closeButton>
        <Modal.Title>Búsquedas</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto', display: 'flex', width: '100%', justifyContent: 'space-between'}} className="d-block d-lg-flex">
        <div className="scroll-container" style={{ width: '100%', maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
          <Form style={{ flexGrow: 1 }}>
            <div style={{display: 'flex', justifyContent:'space-between', marginRight: '20px'}}>
              <Form.Group className="mb-3">
                <Form.Label>Dato</Form.Label>
                <Dropdown onSelect={(value) => handleChange('dato', value)}>
                  <Dropdown.Toggle variant="primary" id="dropdown-dato">
                    {searchData.dato || "Seleccionar"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {/* Opciones dinámicas basadas en la columna "Dato" */}
                    {datosUnicos.map((dato, index) => (
                      <Dropdown.Item key={index} eventKey={dato}>
                        {dato}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Valor</Form.Label>
                <Dropdown onSelect={(value) => handleChange('valor', value)}>
                  <Dropdown.Toggle variant="primary" id="dropdown-valor">
                    {searchData.valor || "Seleccionar"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {/* Opciones dinámicas basadas en los valores filtrados de "DatoBuscado" */}
                    {valorOptions.map((valor, index) => (
                      <Dropdown.Item key={index} eventKey={valor}>
                        {valor}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </div>
            <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'end', marginRight: '20px'}}>
              <Form.Group className="mb-3">
                <Form.Label>Fuente</Form.Label>
                <Dropdown onSelect={(value) => handleChange('fuente', value)}>
                  <Dropdown.Toggle variant="primary" id="dropdown-fuente">
                    {searchData.fuente || "Seleccionar"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {/* Opciones dinámicas basadas en los valores filtrados de "idFuente" */}
                    {fuenteOptions.map((fuente, index) => (
                      <Dropdown.Item key={index} eventKey={fuente}>
                        {fuente}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Encontrado"
                  name="encontrado"
                  checked={searchData.encontrado}
                  onChange={(e) => handleChange('encontrado', e.target.checked)}
                />
              </Form.Group>
            </div>
            {/* Mostrar el formulario si showForm es true */}
            {showForm && (
              <Form.Group className="mb-3 me-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={searchData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                />
                <Form.Label>Puesto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={searchData.puesto}
                  onChange={(e) => handleChange('puesto', e.target.value)}
                />
                <Form.Label>Teléfonos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={searchData.telefonos}
                  onChange={(e) => handleChange('telefonos', e.target.value)}
                />
                <div>
                  {phoneNumbers.map((phone, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '3px', marginBottom: '3px'}}>
                      <Button variant="danger" size="sm" style={{padding: '0px 5px'}} onClick={() => handleRemovePhoneNumber(index)}>X</Button>
                      <span style={{ marginLeft: '10px' }}>{phone}</span>
                    </div>
                  ))}
                </div>
                <Form.Label>Lugar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={searchData.lugar}
                  onChange={(e) => handleChange('lugar', e.target.value)}
                />
                <Form.Label>Link de la página</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={searchData.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                />
              </Form.Group>
            )}
          </Form>
          <div style={{ marginTop: 'auto' }}>
            <Button
              variant="primary"
              type="button"
              onClick={handleGuardarClick}
              style={{ marginBottom: '10px' }}
              disabled={!isFormValid} // Deshabilitar el botón si el formulario no es válido
            >
              Guardar
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="text-center ">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <div className="scroll-container" style={{ overflow: 'auto', maxHeight: '70vh', maxWidth: '800px', minWidth: '250px'}}>
            <Table striped bordered hover variant="dark" className="mt-3">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Ejecutivo</th>
                  <th>Dato</th>
                  <th>Dato Buscado</th>
                  <th>idFuente</th>
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
                    <td>{item.idFuente}</td>
                    <td>{item.Encontrado}</td>
                    <td>{item.Telefonos}</td>
                    <td>{item.Persona}</td>
                    <td>{item.Puesto}</td>
                    <td>{item.Lugar}</td>
                    <td>{item.idEjecutivo}</td>
                    <td>{item.InfoEncontrada}</td>
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
  );
};

export default Search;