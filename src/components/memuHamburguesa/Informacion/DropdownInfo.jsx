import { useState, useContext } from 'react';
import { AppContext } from '../../../pages/Managment'; // Ajusta la ruta según tu estructura de archivos

import Dropdown from 'react-bootstrap/Dropdown';
import Payments from './Payments'; // Asegúrate de importar el componente
import "../../../scss/styles.scss";
import { getPaymentsData } from '../../../services/gespawebServices';

function DropdownInfo() {


  const [showPayments, setShowPayments] = useState(false);
  const [paymentsData, setPaymentsData] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);



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
  

  return ( 
    <>
      <Dropdown className=''>
      <Dropdown.Toggle className="custom-dropdown-toggle d-flex align-items-center" id="dropdown-right">
      Información
        </Dropdown.Toggle>
        <Dropdown.Menu placement="end" style={{backgroundColor: '#1d1f20', border: 'none'}} className='custom-dropdown-menu'>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Multideudores</Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">Adicionales</Dropdown.Item>
          <Dropdown.Item onClick={handleShowPayments} className="custom-dropdown-item">Pagos</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal */} 
      <Payments show={showPayments} handleClose={handleClosePayments} data={paymentsData} loadingPayments={loadingPayments} />
      {/* <Complaints show={showComplaints} handleClose={handleCloseComplaints} data={complaintsData} loading={loadingComplaints} /> */}
      {/* <Comments show={showComments} handleClose={handleCloseComments} data={commentsData} loading={loadingComments} /> */}
    </>
  );
}

export default DropdownInfo;