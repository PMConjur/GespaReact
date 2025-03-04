import Dropdown from 'react-bootstrap/Dropdown';
import { MenuButtonFill } from 'react-bootstrap-icons';

function DropdownActions() {
  return (
    <Dropdown className='mb-3'>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
        <span className="me-2"><MenuButtonFill/></span> 
        <h5 className="mb-0">Acciones</h5>
      </Dropdown.Toggle>
      <Dropdown.Menu >
        <Dropdown.Item href="#">Negociaciones</Dropdown.Item>
        <Dropdown.Item href="#">Seguimientos</Dropdown.Item>
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
  );
}

export default DropdownActions;