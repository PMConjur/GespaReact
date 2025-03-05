import Dropdown from 'react-bootstrap/Dropdown';
import { MenuButtonFill } from 'react-bootstrap-icons';

function DropdownActions() {
  return (
    <Dropdown className='mb-3'>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
        <span className="me-2"><MenuButtonFill/></span> 
        <h5 className="mb-0">Acciones</h5>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}}>
        <Dropdown.Item href="/maintenance">Negociaciones</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Seguimientos</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Accionamientos</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Busqueda</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Cargos en linea</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Comentarios</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Estados de cuenta</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Quejas</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Simuladores</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Procesos WLP</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownActions;