import { Container } from 'react-bootstrap';
import { InfoSquareFill } from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import "../../../scss/styles.scss";

function DropdownInfo() {
  return ( 
    <Dropdown className=''>
    <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-right">
    Información
      </Dropdown.Toggle>
      <Dropdown.Menu placement="end" style={{backgroundColor: '#1d1f20', border: 'none'}}>
        <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Multideudores</Dropdown.Item>
        <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Adicionales</Dropdown.Item>
        <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Pagos</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownInfo;