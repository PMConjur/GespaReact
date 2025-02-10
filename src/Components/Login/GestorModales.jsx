import React, { useRef, useState } from "react";
import ModalCuenta from "./ModalCuenta";
import ModalCambioContraseña from "./ModalCambioContraseña";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const GestorModales = () => {
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
      <ModalCuenta modalRef={modalRef} openSecondModal={openSecondModal} />

      {/* Segundo Modal */}
      <ModalCambioContraseña
        showSecondModal={showSecondModal}
        closeSecondModal={closeSecondModal}
      />
    </div>
  );
};

export default GestorModales;
