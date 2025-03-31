
import { Modal, Button } from "react-bootstrap";
import TablePayments from "../../TablePayments";
// import FormPayments from "./FormPayments";

const Payments = ({ 
    show, 
    handleClose 
    }) => {
    return (
        <Modal 
        show={show}
        onHide={handleClose} 
        size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Pagos</Modal.Title>
            </Modal.Header>
            <Modal.Body
            className="flex-grow-1 p-0 d-flex flex-column"
            style={{
              overflow: "hidden", // Evita desbordamiento del contenido
            }}
            >
                <TablePayments/>
                {/* <FormPayments handleClose={handleClose}/> */}
            </Modal.Body>
        </Modal>
    );
};

export default Payments;