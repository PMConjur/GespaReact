import { Container } from 'react-bootstrap';
import { InfoSquareFill } from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';

function DropdownInfo() {
  return ( 
    <Dropdown className='mb-3'>
    <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-right">
        <span className="me-2"><InfoSquareFill /></span> 
        <h5 className="mb-0">Información</h5>
      </Dropdown.Toggle>
      <Dropdown.Menu placement="end" style={{backgroundColor: '#1d1f20', border: 'none'}}>
        <Dropdown.Item href="/maintenance">Multideudores</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Adicionales</Dropdown.Item>
        <Dropdown.Item href="/maintenance">Pagos</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownInfo;