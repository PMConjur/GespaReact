import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AccionamientosModal from './Drives'; // Importa el componente del modal
import { fetchDrives } from '../../../services/gespawebServices'; // Importa la función que obtiene los datos de accionamientos
import { AppContext } from '../../../pages/Managment'; // Ajusta la ruta según tu estructura de archivos
import "../../../scss/styles.scss";

import FollowUps from './FollowUps'; // Asegúrate de importar el componente
import Talks from './Talks'; // Asegúrate de importar el componente
import Onlinecharge from './OnlineCharges'; // Importa el nuevo componente
import { getFollowUpsData, getTalksData, getOnlinechargeData } from '../../../services/gespawebServices';

const DropdownActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [accionamientosData, setAccionamientosData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpsData, setFollowUpsData] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const [showTalks, setShowTalks] = useState(false);
  const [talksData, setTalksData] = useState([]);
  const [loadingtalks, setLoadingtalks] = useState(false);

  const [showOnlinecharge, setShowOnlinecharge] = useState(false);
  const [onlinechargeData, setOnlinechargeData] = useState([]);
  const [loadingOnlinecharge, setLoadingonlinecharge] = useState(false);

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

  const handleCloseModal = () => setShowModal(false);


  //seguimiwntos
  const handleShowFollowUps = async () => {
    setLoadingFollow(true);
    try {
      const followUps = await getFollowUpsData(searchResults); // 🔹 Ahora recibe toda la lista
      setFollowUpsData(followUps.flat()); // 🔹 Asegura que la data es un array plano
      setShowFollowUps(true);
    } catch (error) {
      console.error("Error al obtener los datos de seguimiento:", error);
    } finally {
      setLoadingFollow(false);
    }
  };
  
  
  const handleCloseFollowUps = () => setShowFollowUps(false);


    //negociaciones//

    const handleShowTalks = async () => {
      setLoadingtalks(true);
      try {
        // Aquí debes definir los valores de idCuenta y idCartera según tu aplicación
        const talks = await getTalksData(searchResults); // Obtener los datos de negociaciones
        setTalksData(talks.flat()); // Establece los datos recibidos
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
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Comentarios</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Quejas</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Simuladores</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Procesos WLP</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal */}
      <AccionamientosModal show={showModal} handleClose={handleCloseModal} data={accionamientosData} />
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} data={followUpsData} loadingFollow={loadingFollow} />
      <Talks show={showTalks} handleClose={handleCloseTalks} dataTalks={talksData} loading={loadingtalks} />
      <Onlinecharge show={showOnlinecharge} handleClose={handleCloseOnlinecharge} data={onlinechargeData} loading={loadingOnlinecharge} />
    </>
  );
}

export default DropdownActions;