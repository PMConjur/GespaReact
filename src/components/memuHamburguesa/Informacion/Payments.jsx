import { useContext } from "react";
import { Modal } from "react-bootstrap";
import TablePayments from "../../TablePayments";
import { AppContext } from "../../../pages/Managment";
import FormPayments from "./FormPayments";

const Payments = ({ show, handleClose }) => {
    const { isPaymentActive, setIsPaymentActive } = useContext(AppContext); // Asegúrate de que setIsPaymentActive esté disponible

    const handleModalClose = () => {
        if (typeof setIsPaymentActive === "function") {
            setIsPaymentActive(false); // Ajusta isPaymentActive a false si la función está disponible
        }
        handleClose(); // Asegura que el modal se cierre correctamente
    };

    return (
        <Modal show={show} onHide={handleModalClose} size="xl"> {/* Usa handleModalClose */}
            <Modal.Header closeButton>
                <Modal.Title>Pagos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isPaymentActive === true ? (
                    <>
                        <TablePayments />
                        <FormPayments />
                    </>
                ) : (
                    <>
                        <TablePayments />
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default Payments;