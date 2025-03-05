import { PersonLinesFill } from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';

function DropdownInfo() {
  return (
    <Dropdown className='mb-3'>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
        <span className="me-2"><PersonLinesFill/></span> 
        <h5 className="mb-0">Ejecutivo</h5>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}}>
        <Dropdown.Item href="/maintenance">Gestiones del dia</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Scripts</Dropdown.Item>
        <Dropdown.Item href="v">Negociaciones</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownInfo;