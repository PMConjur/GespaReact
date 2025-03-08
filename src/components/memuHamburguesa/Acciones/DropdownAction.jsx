import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AccionamientosModal from './Drives'; // Importa el componente del modal
import { fetchDrives } from '../../../services/gespawebServices'; // Importa la función que obtiene los datos de accionamientos
import { AppContext } from '../../../pages/Managment'; // Ajusta la ruta según tu estructura de archivos
import "../../../scss/styles.scss";

const DropdownActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [accionamientosData, setAccionamientosData] = useState([]);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpsData, setFollowUpsData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    
  const handleCloseModal = () => setShowModal(false);
  const handleCloseFollowUps = () => setShowFollowUps(false);

  return (
    <>
       <Dropdown className='' >
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
          Acciones
        </Dropdown.Toggle>
        <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}} className='custom-dropdown-menu'>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Negociaciones</Dropdown.Item>
          <Dropdown.Item onClick={handleShowFollowUps} className="custom-dropdown-item">Seguimientos</Dropdown.Item>
          <Dropdown.Item onClick={handleShowModal} className="custom-dropdown-item">Accionamientos</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Busqueda</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Cargos en linea</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Comentarios</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Quejas</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Simuladores</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Procesos WLP</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal */}
      <AccionamientosModal show={showModal} handleClose={handleCloseModal} data={accionamientosData} />
    </>
  );
}

export default DropdownActions;