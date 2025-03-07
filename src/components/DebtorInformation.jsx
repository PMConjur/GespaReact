import { useState } from "react";
import { Row, Breadcrumb } from "react-bootstrap";
import ProductivityModal from "./ProductivityModal"; // Import ProductivityModal component
import Recovery from "./Recovery";
import Times from "./Times";
import DropdownsInfo from "../../src/components/memuHamburguesa/Informacion/DropdownInfo"
import DropdownAction from "../../src/components/memuHamburguesa/Acciones/DropdownAction"
import DropdownExecutive from "../../src/components/memuHamburguesa/Ejecutivo/DropdownExecutive"

const DebtorInformation = () => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModalR, setShowModalR] = useState(false);
  const handleShowModalR = () => setShowModalR(true);
  const handleCloseModalR = () => setShowModalR(false);
  // Add state and functions for the Times modal
  const [showModalTim, setShowModalTim] = useState(false);
  const handleShowModalTim = () => setShowModalTim(true);
  const handleCloseModalTim = () => setShowModalTim(false);

  return (
    <Row>
      <h4 className="text-secondary">
        Cartera: <strong className="text-white">American Express</strong>
      </h4>{" "}
      <Breadcrumb style={{zIndex: '100'}}>
        <Breadcrumb.Item href="#" onClick={handleShowModal}>
          Productividad
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#" onClick={handleShowModalR}>
          Recuperación
        </Breadcrumb.Item>
        {/*Migaja Times*/}
        <Breadcrumb.Item href="#" onClick={handleShowModalTim}>
          Tiempos
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          <DropdownAction />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          <DropdownsInfo />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          <DropdownExecutive />
        </Breadcrumb.Item>
      </Breadcrumb>
      {showModal && (
        <ProductivityModal show={showModal} onHide={handleCloseModal} />
      )}
      {showModalR && (
        <Recovery show={showModalR} handleClose={handleCloseModalR} />
      )}
      {/**Mandar a llamar comp times */}
      {showModalTim && (
        <Times show={showModalTim} handleClose={handleCloseModalTim} />
      )}
    </Row>
  );
};

export default DebtorInformation;
