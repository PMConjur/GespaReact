import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { MenuButtonFill } from 'react-bootstrap-icons';
import FollowUps from './FollowUps'; // Asegúrate de importar el componente
import { getGestionData } from '../../../services/gespawebServices'; // Asegúrate de importar la función

function DropdownActions() {
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpsData, setFollowUpsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShowFollowUps = async () => {
    setLoading(true);
    try {
      // Aquí debes definir los valores de idCuenta y idCartera según tu aplicación
      const idCuenta = '370700000000004'; // Ejemplo
      const idCartera = 1; // Ejemplo
      const data = await getGestionData(idCuenta, idCartera);
      console.log('Datos de seguimiento recibidos:', data); // Verificar los datos recibidos
      setFollowUpsData(data); // Establece los datos recibidos
    } catch (error) {
      console.error('Error al cargar los datos de seguimiento:', error);
    } finally {
      setLoading(false);
    }
    setShowFollowUps(true);
  };

  const handleCloseFollowUps = () => setShowFollowUps(false);

  return (
    <>
      <Dropdown className='mb-3'>
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
          <span className="me-2"><MenuButtonFill /></span>
          <h5 className="mb-0">Acciones</h5>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#">Negociaciones</Dropdown.Item>
          <Dropdown.Item onClick={handleShowFollowUps}>Seguimientos</Dropdown.Item>
          <Dropdown.Item href="#">Accionamientos</Dropdown.Item>
          <Dropdown.Item href="#">Busqueda</Dropdown.Item>
          <Dropdown.Item href="#">Cargos en linea</Dropdown.Item>
          <Dropdown.Item href="#">Comentarios</Dropdown.Item>
          <Dropdown.Item href="#">Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="#">Quejas</Dropdown.Item>
          <Dropdown.Item href="#">Simuladores</Dropdown.Item>
          <Dropdown.Item href="#">Procesos WLP</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} data={followUpsData} loading={loading} />
    </>
  );
}

export default DropdownActions;
