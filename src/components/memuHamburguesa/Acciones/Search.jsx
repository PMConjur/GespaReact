import { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Table, Spinner, Dropdown } from 'react-bootstrap';
import { fetchActionsSearch } from '../../../services/gespawebServices';
import { AppContext } from "../../../pages/Managment";

const Search = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext);

  const [searchData, setSearchData] = useState({
    dato: 'Nombre', // idCartera
    fuente: 'ABC Teléfonos', // Jerarquia
    encontrado: false,
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  // Cargar datos automáticamente cuando el modal se abre
  useEffect(() => {
    if (show && searchResults && searchResults.length > 0) {
      fetchData(searchResults[0].idCuenta.trim()); // Llama a la función para obtener los datos con idCuenta
    }
  }, [show, searchResults]); // Dependencias: show y searchResults

  const fetchData = async (idCuenta) => {
    setLoading(true); // Activar estado de carga
    try {
      console.log("Cargando datos automáticamente...");

      // Pasar idCuenta a fetchActionsSearch
      const response = await fetchActionsSearch(idCuenta);
      console.log("Respuesta del servidor:", response);

      // Mapear los campos de la respuesta a los nombres que espera la tabla
      const mappedData = response.map((item) => ({
        Fecha: item.Fecha_Insert, // Mapear Fecha_Insert a Fecha
        Hora: item.Segundo_Insert, // Mapear Segundo_Insert a Hora
        Ejecutivo: item.Ejecutivo, // Mapear Ejecutivo a Ejecutivo
        Dato: item.idDato, // Mapear idDato a Dato
        DatoBuscado: item.DatoBuscado, // Mapear DatoBuscado a DatoBuscado
        idFuente: item.idFuente, // Mapear idFuente
        Encontrado: item._Encontrado, // Mapear _Encontrado
        Telefonos: item.Tel\u00E9fonos, // Mapear Teléfonos
        Persona: Object.keys(item.Persona).length ? JSON.stringify(item.Persona) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        Puesto: Object.keys(item.Puesto).length ? JSON.stringify(item.Puesto) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        Lugar: Object.keys(item.Lugar).length ? JSON.stringify(item.Lugar) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        idEjecutivo: item.idEjecutivo, // Mapear idEjecutivo 
        InfoEncontrada: Object.keys(item.InfoEncontrada).length ? JSON.stringify(item.InfoEncontrada) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        Confirmado: item._Confirmado, // Mapear _Confirmado
        Link: item.Link || '--', // Mapear Link o mostrar 'N/A'
      }));

      // Actualiza la tabla con los datos mapeados
      setTableData(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      alert("Hubo un error al cargar los datos.");
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  const handleChange = (name, value) => {
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar datos al endpoint fetchActionsSearch
  const handleGuardarClick = async () => {
    console.log("handleGuardarClick ejecutado"); // Verifica que esto aparezca en la consola

    console.log("Datos a enviar:", searchData); // Verifica los datos antes de enviarlos

    try {
      console.log("Enviando datos al endpoint...");

      // Pasar idCuenta de searchResults a fetchActionsSearch
      const idCuenta = searchResults[0].idCuenta.trim();
      const response = await fetchActionsSearch(idCuenta);
      console.log("Respuesta del servidor:", response);

      // Mapear los campos de la respuesta a los nombres que espera la tabla
      const mappedData = response.map((item) => ({
        Fecha: item.Fecha_Insert, // Mapear Fecha_Insert a Fecha
        Hora: item.Segundo_Insert, // Mapear Segundo_Insert a Hora
        Ejecutivo: item.Ejecutivo, // Mapear Ejecutivo a Ejecutivo
        Dato: item.idDato, // Mapear idDato a Dato
        DatoBuscado: item.DatoBuscado, // Mapear DatoBuscado a DatoBuscado
        idFuente: item.idFuente, // Mapear idFuente
        Encontrado: item._Encontrado, // Mapear _Encontrado
        Telefonos: item.Tel\u00E9fonos, // Mapear Teléfonos
        Persona: Object.keys(item.Persona).length ? JSON.stringify(item.Persona) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        Puesto: Object.keys(item.Puesto).length ? JSON.stringify(item.Puesto) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        Lugar: Object.keys(item.Lugar).length ? JSON.stringify(item.Lugar) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        idEjecutivo: item.idEjecutivo, // Mapear idEjecutivo
        InfoEncontrada: Object.keys(item.InfoEncontrada).length ? JSON.stringify(item.InfoEncontrada) : '--', // Convertir objeto a cadena JSON o mostrar 'N/A'
        Confirmado: item._Confirmado, // Mapear _Confirmado
        Link: item.Link || '--', // Mapear Link o mostrar 'N/A'
      }));

      // Actualiza la tabla con los datos mapeados
      setTableData(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      alert("Hubo un error al enviar la solicitud.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Búsquedas - Gespa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: 'flex' }}>
        <Form style={{width: 'auto'}}>
          <Form.Group className="mb-3">
            <Form.Label>Dato</Form.Label>
            <Dropdown onSelect={(value) => handleChange('dato', value)}>
              <Dropdown.Toggle variant="primary" id="dropdown-dato" style={{width: '100%'}}>
                {searchData.dato}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Nombre">Nombre</Dropdown.Item>
                <Dropdown.Item eventKey="Teléfono">Teléfono</Dropdown.Item>
                <Dropdown.Item eventKey="Empresa">Empresa</Dropdown.Item>
                <Dropdown.Item eventKey="Domicilio">Domicilio</Dropdown.Item>
                <Dropdown.Item eventKey="Adicional">Adicional</Dropdown.Item>
                <Dropdown.Item eventKey="Correo">Correo</Dropdown.Item>
                <Dropdown.Item eventKey="RFC">RFC</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fuente</Form.Label>
            <Dropdown onSelect={(value) => handleChange('fuente', value)}>
              <Dropdown.Toggle variant="primary" id="dropdown-fuente">
                {searchData.fuente}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <Dropdown.Item eventKey="ABC Teléfonos">ABC Teléfonos</Dropdown.Item>
                <Dropdown.Item eventKey="Buho Legal">Buho Legal</Dropdown.Item>
                <Dropdown.Item eventKey="Cliente">Cliente</Dropdown.Item>
                <Dropdown.Item eventKey="Google">Google</Dropdown.Item>
                <Dropdown.Item eventKey="Lanas">Lanas</Dropdown.Item>
                <Dropdown.Item eventKey="Lexis">Lexis</Dropdown.Item>
                <Dropdown.Item eventKey="Paginas blancas">Paginas blancas</Dropdown.Item>
                <Dropdown.Item eventKey="RPP">RPP</Dropdown.Item>
                <Dropdown.Item eventKey="Seccion Amarilla">Seccion Amarilla</Dropdown.Item>
                <Dropdown.Item eventKey="Telmex">Telmex</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Encontrado"
              name="encontrado"
              checked={searchData.encontrado}
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
          </Form.Group>
          {/* Botón con onClick */}
          <Button
            variant="primary"
            type="button" // Cambia a type="button" para evitar el envío automático del formulario
            onClick={handleGuardarClick} // Manejador de clic
          >
            Guardar
          </Button>
        </Form>

        {/* Mostrar spinner mientras se cargan los datos */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <div style={{ overflow: 'auto', maxHeight: '400px', maxWidth: '700px' }}>
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