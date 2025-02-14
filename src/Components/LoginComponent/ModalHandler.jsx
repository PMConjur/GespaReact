import React, { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import ModalPrincipal from "./ModalPrincipal";
import ModalChangePassword from "./ModalChangePassword";

const ModalHandler = ({ password, user }) => {
  const [showSecondModal, setShowSecondModal] = useState(false);

  useEffect(() => {
    const modalElement = document.getElementById("firstModal");
    if (modalElement) {
      new Modal(modalElement); // Inicializa el modal correctamente
    }
  }, []);

  const openSecondModal = () => {
    const firstModalElement = document.getElementById("firstModal");
    const firstModalInstance = Modal.getInstance(firstModalElement);
    firstModalInstance.hide(); // Cierra el primer modal
    setShowSecondModal(true); // Abre el segundo modal
  };

  const closeSecondModal = () => setShowSecondModal(false);

  return (
    <>
      <ModalPrincipal
        openSecondModal={openSecondModal}
        password={password}
        user={user}
      />
      <ModalChangePassword
        showSecondModal={showSecondModal}
        closeSecondModal={closeSecondModal}
        currentPassword={password}
      />
    </>
  );
};

export default ModalHandler;
