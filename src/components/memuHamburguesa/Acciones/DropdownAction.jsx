import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { MenuButtonFill } from 'react-bootstrap-icons';
import AccionamientosModal from './Drives'; // Importa el componente del modal
import { fetchDrives } from '../../../services/gespawebServices'; // Importa la función que obtiene los datos de accionamientos
import { AppContext } from '../../../pages/Managment'; // Ajusta la ruta según tu estructura de archivos

const DropdownActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [accionamientosData, setAccionamientosData] = useState([]);

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

  return (
    <>
      <Dropdown className='mb-3'>
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-basic">
          <span className="me-2"><MenuButtonFill/></span> 
          <h5 className="mb-0">Acciones</h5>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{backgroundColor: '#1d1f20', border: 'none'}}>
          <Dropdown.Item href="/maintenance">Negociaciones</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Seguimientos</Dropdown.Item>
          <Dropdown.Item onClick={handleShowModal}>Accionamientos</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Busqueda</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Cargos en linea</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Comentarios</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Estados de cuenta</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Quejas</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Simuladores</Dropdown.Item>
          <Dropdown.Item href="/maintenance">Procesos WLP</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal */}
      <AccionamientosModal show={showModal} handleClose={handleCloseModal} data={accionamientosData} />
    </>
  );
}

export default DropdownActions;