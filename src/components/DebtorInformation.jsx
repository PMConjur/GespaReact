import { useState } from "react";
import { Row, Breadcrumb } from "react-bootstrap";
import ProductivityModal from "./ProductivityModal"; // Import ProductivityModal component

const DebtorInformation = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Row>
      <h4 className="text-secondary">
        Cartera: <strong className="text-white">American Express</strong>
      </h4>{" "}
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={handleShowModal}>
          Productividad
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Recuperación</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Tiempos</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Simulador</Breadcrumb.Item>
      </Breadcrumb>
      {showModal && (
        <ProductivityModal show={showModal} onHide={handleCloseModal} />
      )}
    </Row>
  );
};

export default DebtorInformation;
