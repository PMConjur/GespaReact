import { useState, useContext } from 'react';
import { AppContext } from '../../../pages/Managment'; // Ajusta la ruta según tu estructura de archivos

import Dropdown from 'react-bootstrap/Dropdown';
import Payments from './Payments'; // Asegúrate de importar el componente
import Aditionals from './Aditionals'; // Asegúrate de importar el componente
import "../../../scss/styles.scss";

import { getPaymentsData, getAditionalsData } from '../../../services/gespawebServices';
//
//import Dropdown from 'react-bootstrap/Dropdown';
//import "../../../scss/styles.scss";

function DropdownInfo() {

  const [showPayments, setShowPayments] = useState(false);
  const [paymentsData, setPaymentsData] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);


  const [showAditionals, setShowAditionals] = useState(false);
  const [aditionalsData, setAditionalsData] = useState([]);
  const [loadingAditionals, setLoadingAditionals] = useState(false);



    // Consumir el contexto
    const { searchResults } = useContext(AppContext);
    
    //pagos//
      const handleShowPayments = async () => {
        setLoadingPayments(true);
        try {
          // Aquí debes definir los valores de idCuenta y idCartera según tu aplicación
          const talks = await getPaymentsData(searchResults); // Obtener los datos de pagos
          setPaymentsData(talks.flat()); // Establece los datos recibidos
          setShowPayments(true);
        } catch (error) {
          console.error('Error al cargar los datos de pagos:', error);
        } finally {
          setLoadingPayments(false);
        }
      };
    
      const handleClosePayments = () => setShowPayments(false);
  
      // Aditionales
      const handleShowAditionals = async () => {
        setLoadingAditionals(true);
        try {
          // Aquí debes definir los valores de idCuenta y idCartera según tu aplicación
          const Aditionals = await getAditionalsData(searchResults); // Obtener los datos de pagos
          setAditionalsData(Aditionals.flat()); // Establece los datos recibidos
          setShowAditionals(true);
        } catch (error) {
          console.error('Error al cargar los datos de Adicionales:', error);
        } finally {
          setLoadingAditionals(false);
        }
      };
    
      const handleCloseAditionals = () => setShowAditionals(false);
  

  return ( 
    <>
      <Dropdown className=''>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-right">
      Información
        </Dropdown.Toggle>
        <Dropdown.Menu placement="end" style={{backgroundColor: '#1d1f20', border: 'none'}} className='custom-dropdown-menu'>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Multideudores</Dropdown.Item>
          <Dropdown.Item onClick={handleShowAditionals} className="custom-dropdown-item">Adicionales</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Domicilios</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Correos</Dropdown.Item>
          <Dropdown.Item onClick={handleShowPayments} className="custom-dropdown-item">Pagos</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal */} 
      <Payments show={showPayments} handleClose={handleClosePayments} data={paymentsData} loadingPayments={loadingPayments} />
      <Aditionals show={showAditionals} handleClose={handleCloseAditionals} data={aditionalsData} loadingAditionals={loadingAditionals} />

{/* Renderiza el modal 


<MultiDeptor show={showModal} handleClose={handleClose} />
const [showModal, setShowModal] = useState(false);

const handleShow = () => setShowModal(true);
const handleClose = () => setShowModal(false);
*/}

 
    </>
  );
}

export default DropdownInfo;