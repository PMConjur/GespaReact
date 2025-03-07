import { PersonLinesFill } from 'react-bootstrap-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import "../../../scss/styles.scss";

function DropdownInfo() {
  return (
    <Dropdown className=''>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
       Ejecutivo
      </Dropdown.Toggle>
      <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}}>
        <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Gestiones del dia</Dropdown.Item>
        <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Scripts</Dropdown.Item>
        <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Negociaciones</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownInfo;