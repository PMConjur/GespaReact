import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AppContext } from '../../../pages/Managment';
import "../../../scss/styles.scss";
import EstadoCuentaModal from './AccountStatements';
import FollowUps from './FollowUps';
import Talks from './Talks';
import Drives from './Drives';
import { getFollowUpsData, getTalksData, getOnlinechargeData } from '../../../services/gespawebServices';
import Search from './Search';
import OnlineCharge from './OnlineCharge';


const DropdownActions = () => {
  const [modalShow, setModalShow] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpsData, setFollowUpsData] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showTalks, setShowTalks] = useState(false);
  const [talksData, setTalksData] = useState([]);
  const [loadingtalks, setLoadingtalks] = useState(false);
  const [showDrives, setShowDrives] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  const [showOnlinecharge, setShowOnlinecharge] = useState(false);
  const [onlinechargeData, setOnlinechargeData] = useState([]);
  const [loadingOnlinecharge, setLoadingonlinecharge] = useState(false);

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



  // cargos en línea
  const handleShowOnlinecharge = async () => {
    setLoadingonlinecharge(true);
    try {
      const onlinecharge = await getOnlinechargeData(searchResults); // Obtener los datos de cargos en línea
      setOnlinechargeData(onlinecharge.flat()); // Establece los datos recibidos
      setShowOnlinecharge(true);
    } catch (error) {
      console.error('Error al cargar los datos de cargos en línea:', error);
    } finally {
      setLoadingonlinecharge(false);
    }
  };

  const handleCloseOnlinecharge = () => setShowOnlinecharge(false);

  return (
    <>
      <Dropdown className='' >
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
          Acciones
        </Dropdown.Toggle>
        <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}} className='custom-dropdown-menu'>
          <Dropdown.Item onClick={handleShowTalks} className="custom-dropdown-item">Negociaciones</Dropdown.Item>
          <Dropdown.Item onClick={handleShowFollowUps} className="custom-dropdown-item">Seguimientos</Dropdown.Item>
          <Dropdown.Item onClick={handleShowDrives} className="custom-dropdown-item">Accionamientos</Dropdown.Item>
          <Dropdown.Item onClick={handleOpenModal} href="/maintenance" className="custom-dropdown-item">Busqueda</Dropdown.Item>
          <Dropdown.Item onClick={handleShowOnlinecharge} className="custom-dropdown-item">Cargos en línea</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Comentarios</Dropdown.Item>  
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item" onClick={() => setModalShow(true)}>Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Quejas</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Simuladores</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Procesos WLP</Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>

      <EstadoCuentaModal show={modalShow} handleClose={() => setModalShow(false)} />
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} data={followUpsData} loadingFollow={loadingFollow} />
      <Talks show={showTalks} handleClose={handleCloseTalks} dataTalks={talksData} loading={loadingtalks} />
      <OnlineCharge show={showOnlinecharge} handleClose={handleCloseOnlinecharge} data={onlinechargeData} loading={loadingOnlinecharge} />
      <Drives showModal={showDrives} handleCloseModal={handleCloseDrives} />
      <Search show={showModal} handleClose={handleCloseModal} />
    </>
  );
}

export default DropdownActions;