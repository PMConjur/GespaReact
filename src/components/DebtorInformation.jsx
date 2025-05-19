import { useState } from "react";
import { Row, Breadcrumb } from "react-bootstrap";
import ProductivityModal from "./ProductivityModal"; // Import ProductivityModal component
import Recovery from "./Recovery";
import Times from "./Times";
import DropdownsInfo from "../../src/components/memuHamburguesa/Informacion/DropdownInfo"
import DropdownAction from "../../src/components/memuHamburguesa/Acciones/DropdownAction"
import DropdownExecutive from "../../src/components/memuHamburguesa/Ejecutivo/DropdownExecutive"
import CalculatorSimulator from "./CalculatorSimulator";

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

    // Estado para el modal de la Calculadora
    const [showCalculatorModal, setShowCalculatorModal] = useState(false);
    const handleShowCalculatorModal = () => setShowCalculatorModal(true);
    const handleCloseCalculatorModal = () => setShowCalculatorModal(false);

  return (
    <Row>
      <h4 className="text-secondary">
        Cartera: <strong className="text-white">American Express</strong>
      </h4>
      <Breadcrumb style={{ zIndex: "100" }}>
        <Breadcrumb.Item onClick={handleShowModal}>
          Productividad
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={handleShowModalR}>
          Recuperación
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={handleShowModalTim}>Tiempos</Breadcrumb.Item>
        <Breadcrumb.Item onClick={handleShowCalculatorModal}>
          Simulador
        </Breadcrumb.Item>
        <div className="breadcrumb-item text-success">
          <DropdownsInfo />
        </div>
        <div className="breadcrumb-item text-success">
          <DropdownAction/>
        </div>
        <div className="breadcrumb-item text-success">
          <DropdownExecutive/>
        </div>
      </Breadcrumb>
      {showModal && (
        <ProductivityModal show={showModal} onHide={handleCloseModal} />
      )}
      {showModalR && (
        <Recovery show={showModalR} handleClose={handleCloseModalR} />
      )}
      {showModalTim && (
        <Times show={showModalTim} handleClose={handleCloseModalTim} />
      )}
      {showCalculatorModal && (
        <CalculatorSimulator
          show={showCalculatorModal}
          handleClose={handleCloseCalculatorModal}
          showCloseButton={true}
        />
      )}
    </Row>
  );
};

export default DebtorInformation;