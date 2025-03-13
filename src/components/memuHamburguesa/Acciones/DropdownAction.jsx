import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AppContext } from '../../../pages/Managment';
import "../../../scss/styles.scss";
import EstadoCuentaModal from './AccountStatements';
import FollowUps from './FollowUps'; // Asegúrate de importar el componente
import Talks from './Talks'; // Asegúrate de importar el componente
import Onlinecharge from './OnlineCharges'; // Importa el nuevo componente
import { getFollowUpsData, getTalksData, getOnlinechargeData } from '../../../services/gespawebServices';
// import Complaints from './Complaints'; // Importa el nuevo componente
// import { getComplaintsData } from '../../../services/gespawebServices'; // Importa la función que obtiene los datos de quejas
//import Comments from './Comments'; // Importa el nuevo componente
//import { getCommentsData } from '../../../services/gespawebServices'; // Importa la función que obtiene los datos de comentarios
import Drives from './Drives';
import Search from './Search';

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

  const [showOnlinecharge, setShowOnlinecharge] = useState(false);
  const [onlinechargeData, setOnlinechargeData] = useState([]);
  const [loadingOnlinecharge, setLoadingonlinecharge] = useState(false);

  // const [showComplaints, setShowComplaints] = useState(false); // Estado para mostrar el modal de quejas
  // const [complaintsData, setComplaintsData] = useState([]); // Estado para los datos de quejas
  // const [loadingComplaints, setLoadingComplaints] = useState(false); // Estado de carga para quejas

  const [showComments, setShowComments] = useState(false); // Estado para mostrar el modal de comentarios
  const [commentsData, setCommentsData] = useState([]); // Estado para los datos de comentarios
  const [loadingComments, setLoadingComments] = useState(false); // Estado de carga para comentarios

  // Consumir el contexto
  const { searchResults } = useContext(AppContext);


  const handleShowModal = async () => {
    
  console.log("searchResults:", searchResults); // Inspecciona searchResults
    // Verifica si searchResults tiene al menos un elemento
    if (!searchResults || searchResults.length === 0) {
      console.error("No hay resultados de búsqueda disponibles");
      return;
    }

    try {
      // Obtén los datos de accionamientos para cada idCuenta en searchResults
      const drives = await Promise.all(
        searchResults.map(async (result) => {
          const idCuenta = result.idCuenta.trim(); // Elimina espacios en blanco
          console.log("idCuenta limpio:", idCuenta); // Depuración
          return await fetchDrives(1, idCuenta); // Llama a fetchDrives con el idCuenta limpio
        })
      );

      // Aplana el array de resultados (si es necesario)
      const flatDrives = drives.flat();

      // Guarda los datos en el estado
      setAccionamientosData(flatDrives);

      // Muestra el modal
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener los datos de accionamientos:", error);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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

    // // quejas
    // const handleShowComplaints = async () => {
    //   setLoadingComplaints(true);
    //   try {
    //     const complaints = await getComplaintsData(searchResults); // Obtener los datos de quejas
    //     setComplaintsData(complaints.flat()); // Establece los datos recibidos
    //     setShowComplaints(true);
    //   } catch (error) {
    //     console.error('Error al cargar los datos de quejas:', error);
    //   } finally {
    //     setLoadingComplaints(false);
    //   }
    // };

    // const handleCloseComplaints = () => setShowComplaints(false);

    // comentarios
    const handleShowComments = async () => {
      setLoadingComments(true);
      try {
        const comments = await getCommentsData(searchResults); // Obtener los datos de comentarios
        setCommentsData(comments.flat()); // Establece los datos recibidos
        setShowComments(true);
      } catch (error) {
        console.error('Error al cargar los datos de comentarios:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    const handleCloseComments = () => setShowComments(false);
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
          <Dropdown.Item onClick={handleShowModal} className="custom-dropdown-item">Accionamientos</Dropdown.Item>
          <Dropdown.Item onClick={handleShowOnlinecharge} className="custom-dropdown-item">Cargos en línea</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Busqueda</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Quejas</Dropdown.Item>
          <Dropdown.Item onClick={handleShowComments} className="custom-dropdown-item">Comentarios</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item" onClick={() => setModalShow(true)}>Estados de cuenta</Dropdown.Item>
          {/* <Dropdown.Item onClick={handleShowComplaints} className="custom-dropdown-item">Quejas</Dropdown.Item> */}
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Simuladores</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Procesos WLP</Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>

      <EstadoCuentaModal show={modalShow} handleClose={() => setModalShow(false)} />
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} data={followUpsData} loadingFollow={loadingFollow} />
      <Talks show={showTalks} handleClose={handleCloseTalks} dataTalks={talksData} loading={loadingtalks} />
      <Onlinecharge show={showOnlinecharge} handleClose={handleCloseOnlinecharge} data={onlinechargeData} loading={loadingOnlinecharge} />
      {/* <Complaints show={showComplaints} handleClose={handleCloseComplaints} data={complaintsData} loading={loadingComplaints} /> */}
      {/* <Comments show={showComments} handleClose={handleCloseComments} data={commentsData} loading={loadingComments} /> */}
      <Drives showModal={showDrives} handleCloseModal={handleCloseDrives} />
      <Search show={showModal} handleClose={handleCloseModal} />
    </>
  );
}

export default DropdownActions;