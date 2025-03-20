import { useState, useContext } from 'react';
import { AppContext } from '../../../pages/Managment'; // Importar el contexto de la aplicación
import Addresses from './Addresses'; // Importar el componente Addresses
import Dropdown from 'react-bootstrap/Dropdown'; // Importar el componente Dropdown de Bootstrap
import "../../../scss/styles.scss"; // Importar estilos SCSS
import Payments from './Payments'; // Importar el componente Payments
import Aditionals from './Aditionals'; // Importar el componente Aditionals
import { getPaymentsData, getAditionalsData } from '../../../services/gespawebServices'; // Importar funciones de servicio para obtener datos

function DropdownInfo() {
  // Estados para controlar la visibilidad de los modales y la carga de datos
  const [showAddresses, setShowAddresses] = useState(false); // Estado para el modal de Addresses
  const [showPayments, setShowPayments] = useState(false); // Estado para el modal de Payments
  const [paymentsData, setPaymentsData] = useState([]); // Estado para almacenar los datos de pagos
  const [loadingPayments, setLoadingPayments] = useState(false); // Estado para indicar si se están cargando los pagos
  const [showAditionals, setShowAditionals] = useState(false); // Estado para el modal de Aditionals
  const [aditionalsData, setAditionalsData] = useState([]); // Estado para almacenar los datos adicionales
  const [loadingAditionals, setLoadingAditionals] = useState(false); // Estado para indicar si se están cargando los datos adicionales

  // Consumir el contexto para obtener los resultados de búsqueda
  const { searchResults } = useContext(AppContext);

  // Función para manejar la apertura del modal de Payments
  const handleShowPayments = async () => {
    setLoadingPayments(true); // Activar el estado de carga
    try {
      const talks = await getPaymentsData(searchResults); // Obtener los datos de pagos
      setPaymentsData(talks.flat()); // Almacenar los datos de pagos
      setShowPayments(true); // Mostrar el modal de Payments
    } catch (error) {
      console.error('Error al cargar los datos de pagos:', error); // Manejar errores
    } finally {
      setLoadingPayments(false); // Desactivar el estado de carga
    }
  };

  // Función para manejar el cierre del modal de Payments
  const handleClosePayments = () => setShowPayments(false);

  // Función para manejar la apertura del modal de Addresses
  const handleShowAddresses = () => setShowAddresses(true);

  // Función para manejar el cierre del modal de Addresses
  const handleCloseAddresses = () => setShowAddresses(false);

  // Función para manejar la apertura del modal de Aditionals
  const handleShowAditionals = async () => {
    setLoadingAditionals(true); // Activar el estado de carga
    try {
      const aditionals = await getAditionalsData(searchResults); // Obtener los datos adicionales
      setAditionalsData(aditionals.flat()); // Almacenar los datos adicionales
      setShowAditionals(true); // Mostrar el modal de Aditionals
    } catch (error) {
      console.error('Error al cargar los datos de Adicionales:', error); // Manejar errores
    } finally {
      setLoadingAditionals(false); // Desactivar el estado de carga
    }
  };

  // Función para manejar el cierre del modal de Aditionals
  const handleCloseAditionals = () => setShowAditionals(false);

  return (
    <>
      {/* Dropdown para mostrar las opciones de información */}
      <Dropdown className=''>
        <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-right">
          Información
        </Dropdown.Toggle>
        <Dropdown.Menu placement="end" style={{backgroundColor: '#1d1f20', border: 'none'}} className='custom-dropdown-menu'>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Multideudores</Dropdown.Item>
          <Dropdown.Item onClick={handleShowAddresses} className="custom-dropdown-item">Domicilios</Dropdown.Item>
          <Dropdown.Item onClick={handleShowAditionals} className="custom-dropdown-item">Adicionales</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Correos</Dropdown.Item>
          <Dropdown.Item onClick={handleShowPayments} className="custom-dropdown-item">Pagos</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderizar el modal de Payments */}
      <Payments show={showPayments} handleClose={handleClosePayments} data={paymentsData} loadingPayments={loadingPayments} />

      {/* Renderizar el modal de Addresses */}
      <Addresses show={showAddresses} handleClose={handleCloseAddresses} />

      {/* Renderizar el modal de Aditionals */}
      <Aditionals show={showAditionals} handleClose={handleCloseAditionals} data={aditionalsData} loadingAditionals={loadingAditionals} />
    </>
  );
}

export default DropdownInfo;