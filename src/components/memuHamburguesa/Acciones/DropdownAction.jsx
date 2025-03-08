import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { MenuButtonFill } from 'react-bootstrap-icons';
import FollowUps from './FollowUps'; // Asegúrate de importar el componente
//import Tañks from './FollowUps';
import { getFollowUpsData } from '../../../services/gespawebServices';
//import { getTalksData } from '../../../services/gespawebServices';
import { AppContext } from '../../../pages/Managment'; // Ajusta la ruta según tu estructura de archivos


// import Talks from './Talks'; // Asegúrate de importar la función

function DropdownActions() {
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpsData, setFollowUpsData] = useState([]);
  const [loading, setLoading] = useState(false);

    // Consumir el contexto
    const { searchResults } = useContext(AppContext);



  // const [showTalks, setShowTalks] = useState(false);
  // const [talksData, setTalksData] = useState([]);
  // const [loadingtalks, setLoadingtalks] = useState(false);




  const handleShowFollowUps = async () => {
    setLoading(true);
    try {
      const followUps = await getFollowUpsData(searchResults); // 🔹 Ahora recibe toda la lista
      setFollowUpsData(followUps.flat()); // 🔹 Asegura que la data es un array plano
      setShowFollowUps(true);
    } catch (error) {
      console.error("Error al obtener los datos de seguimiento:", error);
    } finally {
      setLoading(false);
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

  // const handleCloseTalks = () => setShowTalks(false);

  return (
    <>
      <Dropdown className='mb-3'>
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
          <span className="me-2"><MenuButtonFill /></span>
          <h5 className="mb-0">Acciones</h5>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShowTalks}>Negociaciones</Dropdown.Item>
          <Dropdown.Item onClick={handleShowFollowUps}>Seguimientos</Dropdown.Item>
          <Dropdown.Item href="#">Accionamientos</Dropdown.Item>
          <Dropdown.Item href="#">Busqueda</Dropdown.Item>
          <Dropdown.Item href="#">Cargos en linea</Dropdown.Item>
          <Dropdown.Item href="#">Comentarios</Dropdown.Item>
          <Dropdown.Item href="#">Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="#">Quejas</Dropdown.Item>
          <Dropdown.Item href="#">Simuladores</Dropdown.Item>
          <Dropdown.Item href="#">Procesos WLP</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} data={followUpsData} loading={loading} />
      {/* <FollowUps show={showTalks} handleClose={handleCloseTalks} data={talksData} loading={loadingtalks} /> */}
    </>
  );
}

export default DropdownActions;