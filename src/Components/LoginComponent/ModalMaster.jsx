import React, { useRef, useState } from "react";
import ModalPrincipal from "./ModalPrincipal";
import ModalChangePassword from "./ModalChangePassword";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const ModalMaster = () => {
  const [showSecondModal, setShowSecondModal] = useState(false);
  const modalRef = useRef(null);

  // Función para abrir el segundo modal y cerrar el primero
  const openSecondModal = () => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.hide(); // Cierra el primer modal
    setTimeout(() => setShowSecondModal(true), 300); // Da tiempo para cerrar antes de mostrar el otro
  };

  // Función para cerrar el segundo modal
  const closeSecondModal = () => {
    setShowSecondModal(false);
  };

  return (
    <div>
      {/* Primer Modal */}
      <ModalPrincipal modalRef={modalRef} openSecondModal={openSecondModal} />

      {/* Segundo Modal */}
      <ModalChangePassword
        showSecondModal={showSecondModal}
        closeSecondModal={closeSecondModal}
      />
    </div>
  );
};

export default ModalMaster;
