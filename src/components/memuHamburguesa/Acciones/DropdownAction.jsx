import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AppContext } from '../../../pages/Managment';
import "../../../scss/styles.scss";
import EstadoCuentaModal from './AccountStatements';
import FollowUps from './FollowUps';
import Talks from './Talks';
import Drives from './Drives';
import { fetchProcessesWLP } from '../../../services/gespawebServices';
import Search from './Search';
import OnlineCharge from './OnlineCharge';
import Complaints from './Complaints'; // Importar el componente Complaints

import ProcessesWLP from './ProcessesWLP';
import { data } from 'react-router-dom';

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
  const [showComplaints, setShowComplaints] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenComplaints = () => setShowComplaints(true); // Función para abrir el modal de quejas
  const handleCloseComplaints = () => setShowComplaints(false);

  const [showOnlinecharge, setShowOnlinecharge] = useState(false);
  const [onlinechargeData, setOnlinechargeData] = useState([]);
  const [loadingOnlinecharge, setLoadingonlinecharge] = useState(false);

  const [showProcessesWLP, setShowProcessesWLP] = useState(false);
  const [processesWLPData, setProcessesWLPData] = useState([]); // Estado para los datos de ProcessesWLP
  const [loadingProcessesWLP, setLoadingProcessesWLP] = useState(false); // Estado para la carga de ProcessesWLP
  const [errorProcessesWLP, setErrorProcessesWLP] = useState(null); // Estado para errores al cargar ProcessesWLP

  const { searchResults } = useContext(AppContext);

  const handleShowFollowUps = () => setShowFollowUps(true); // Solo abre el modal
  const handleCloseFollowUps = () => setShowFollowUps(false);


  const handleShowOnlinecharge = () => setShowOnlinecharge(true); // Solo abre el modal
  const handleCloseOnlinecharge = () => setShowOnlinecharge(false);
  

  const handleShowTalks = () => setShowTalks(true);
  const handleCloseTalks = () => setShowTalks(false);



  const handleShowProcessesWLP = () => setShowProcessesWLP(true);
  const handleCloseProcessesWLP = () => setShowProcessesWLP(false);





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
          <Dropdown.Item onClick={handleShowDrives} className="custom-dropdown-item">Accionamientos</Dropdown.Item>
          <Dropdown.Item onClick={handleOpenModal} href="/maintenance" className="custom-dropdown-item">Busqueda</Dropdown.Item>
          <Dropdown.Item onClick={handleShowOnlinecharge} className="custom-dropdown-item">Cargos en línea</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Comentarios</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item" onClick={() => setModalShow(true)}>Estados de cuenta</Dropdown.Item>
          <Dropdown.Item onClick={handleOpenComplaints} className="custom-dropdown-item">Quejas</Dropdown.Item> {/* Actualizar para abrir el modal de quejas */}
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Simuladores</Dropdown.Item>
          <Dropdown.Item onClick={handleShowProcessesWLP} className="custom-dropdown-item">Procesos WLP</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <EstadoCuentaModal show={modalShow} handleClose={() => setModalShow(false)} />
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} />
      <Talks show={showTalks} handleClose={handleCloseTalks} />
      <OnlineCharge show={showOnlinecharge} handleClose={handleCloseOnlinecharge} data={onlinechargeData} loading={loadingOnlinecharge} />
      <Drives showModal={showDrives} handleCloseModal={handleCloseDrives} />
      <Search show={showModal} handleClose={handleCloseModal} />
      <Complaints show={showComplaints} handleClose={handleCloseComplaints} /> {/* Agregar el modal de quejas */}
      <ProcessesWLP show={showProcessesWLP} handleCloseProcessesWLP={handleCloseProcessesWLP} data={processesWLPData} loading={loadingProcessesWLP} error={errorProcessesWLP} />
    </>
  );
}

export default DropdownActions;