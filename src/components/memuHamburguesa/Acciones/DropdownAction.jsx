import { useState} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../scss/styles.scss";
import EstadoCuentaModal from "./AccountStatements";
import FollowUps from "./FollowUps";
import Talks from "./Talks";
import Drives from "./Drives";
import Search from "./Search";
import OnlineCharge from "./OnlineCharge";
import Complaints from "./Complaints"; // Importar el componente Complaints
import { Back } from "react-bootstrap-icons";
import Comments from "./Comments"; // Importar el componente Comments
import ProcessesWLP from "./ProcessesWLP";

const DropdownActions = () => {
  const [modalShow, setModalShow] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [showTalks, setShowTalks] = useState(false);
  const [showDrives, setShowDrives] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showComments, setShowComments] = useState(false); // Agregar el estado para el modal de comentarios
  const [showSimulators, setShowSimulators] = useState(false); // Estado para el modal de simuladores

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenComplaints = () => setShowComplaints(true); // Función para abrir el modal de quejas
  const handleCloseComplaints = () => setShowComplaints(false);
  const handleOpenComments = () => setShowComments(true); // Función para abrir el modal de comentarios
  const handleCloseComments = () => setShowComments(false); // Función para cerrar el modal de comentarios
  const handleCloseSimulators = () => setShowSimulators(false); // Función para cerrar el modal de simuladores

  const [showOnlineCharge, setShowOnlineCharge] = useState(false);
  const [showProcessesWLP, setShowProcessesWLP] = useState(false);
  const handleShowFollowUps = () => setShowFollowUps(true); // Solo abre el modal
  const handleCloseFollowUps = () => setShowFollowUps(false);

  const handleShowOnlineCharge = () => {
    console.log("Abriendo modal de cargos");
    setShowOnlineCharge(true);
  };
  
  const handleCloseOnlineCharge = () => {
    console.log("Cerrando modal de cargos");
    setShowOnlineCharge(false);
  };

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
      <Dropdown className="aqui">
        <Dropdown.Toggle
          className="custom-dropdown-toggle d-flex align-items-center"
          id="dropdown-basic"
        >
          <span>
            <Back /> Acciones
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{ backgroundColor: "#1d1f20"}}
          className="custom-dropdown-menu"
        >
          <Dropdown.Item
            onClick={handleShowTalks}
            className="custom-dropdown-item"
          >
            Negociaciones
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowFollowUps}
            className="custom-dropdown-item"
          >
            Seguimientos
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowDrives}
            className="custom-dropdown-item"
          >
            Accionamientos
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleOpenModal}
            href="/maintenance"
            className="custom-dropdown-item"
          >
            Busqueda
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowOnlineCharge}
            className="custom-dropdown-item"
          >
            Cargos en línea
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleOpenComments} // Actualizar para abrir el modal de comentarios
            className="custom-dropdown-item"
          >
            Comentarios
          </Dropdown.Item>
          <Dropdown.Item
            href="/maintenance"
            className="custom-dropdown-item"
            onClick={() => setModalShow(true)}
          >
            Estados de cuenta
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleOpenComplaints}
            className="custom-dropdown-item"
          >
            Quejas
          </Dropdown.Item>{" "}
          {/* Actualizar para abrir el modal de quejas */}
          <Dropdown.Item
            onClick={handleShowProcessesWLP}
            className="custom-dropdown-item"
          >
            Procesos WLP
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <EstadoCuentaModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
      />
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} />
      
      <Talks show={showTalks} handleClose={handleCloseTalks} />

      <OnlineCharge 
        show={showOnlineCharge}
        handleCloseOnlineCharge={handleCloseOnlineCharge}
        allowClose={true}
        onFormSuccess={() => console.log("Formulario completado")}
      />
    
      <Drives showModal={showDrives} handleCloseModal={handleCloseDrives} />
      <Search show={showModal} handleClose={handleCloseModal} />
      <Complaints
        show={showComplaints}
        handleClose={handleCloseComplaints}
      />{" "}
      {/* Agregar el modal de quejas */}
      <ProcessesWLP
        show={showProcessesWLP}
        handleCloseProcessesWLP={handleCloseProcessesWLP}
      />
      <Comments
        show={showComments} // Pasar el estado al modal
        handleClose={handleCloseComments} // Pasar la función de cierre al modal
      />
    </>
  );
};

export default DropdownActions;
