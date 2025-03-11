import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AppContext } from '../../../pages/Managment';
import "../../../scss/styles.scss";
import EstadoCuentaModal from './AccountStatements';
import FollowUps from './FollowUps';
import Talks from './Talks';
import Drives from './Drives';
import { getFollowUpsData, getTalksData } from '../../../services/gespawebServices';

const DropdownActions = () => {
  const [modalShow, setModalShow] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpsData, setFollowUpsData] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showTalks, setShowTalks] = useState(false);
  const [talksData, setTalksData] = useState([]);
  const [loadingtalks, setLoadingtalks] = useState(false);
  const [showDrives, setShowDrives] = useState(false);

  const { searchResults } = useContext(AppContext);

  const handleShowFollowUps = async () => {
    setLoadingFollow(true);
    try {
      const followUps = await getFollowUpsData(searchResults);
      setFollowUpsData(followUps.flat());
      setShowFollowUps(true);
    } catch (error) {
      console.error("Error al obtener los datos de seguimiento:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleCloseFollowUps = () => setShowFollowUps(false);

  const handleShowTalks = async () => {
    setLoadingtalks(true);
    try {
      const talks = await getTalksData(searchResults);
      setTalksData(talks.flat());
      setShowTalks(true);
    } catch (error) {
      console.error('Error al cargar los datos de negociaciones:', error);
    } finally {
      setLoadingtalks(false);
    }
  };

  const handleCloseTalks = () => setShowTalks(false);

  const handleShowDrives = () => {
    setShowDrives(true);
  };

  const handleCloseDrives = () => setShowDrives(false);

  return (
    <>
      <Dropdown className='' >
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
          Acciones
        </Dropdown.Toggle>
        <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}} className='custom-dropdown-menu'>
          <Dropdown.Item onClick={handleShowTalks} className="custom-dropdown-item">Negociaciones</Dropdown.Item>
          <Dropdown.Item onClick={handleShowFollowUps} className="custom-dropdown-item">Seguimientos</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Busqueda</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Cargos en linea</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Comentarios</Dropdown.Item>
          <Dropdown.Item onClick={handleShowDrives} className="custom-dropdown-item">Accionamientos</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item" onClick={() => setModalShow(true)}>Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Quejas</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Simuladores</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Procesos WLP</Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>

      <EstadoCuentaModal show={modalShow} handleClose={() => setModalShow(false)} />
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} data={followUpsData} loadingFollow={loadingFollow} />
      <Talks show={showTalks} handleClose={handleCloseTalks} dataTalks={talksData} loading={loadingtalks} />
      <Drives showModal={showDrives} handleCloseModal={handleCloseDrives} />
    </>
  );
}

export default DropdownActions;