import { PersonLinesFill } from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';

function DropdownInfo() {
  return (
    <Dropdown className='mb-3'>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
        <span className="me-2"><PersonLinesFill/></span> 
        <h5 className="mb-0">Ejecutivo</h5>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#">Gestiones del dia</Dropdown.Item>
        <Dropdown.Item href="#">Scripts</Dropdown.Item>
        <Dropdown.Item href="#">Negociaciones</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownInfo;