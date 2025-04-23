
import { Modal, Spinner } from "react-bootstrap";
import TDropdownScripts from "../../TDropdownScripts"; // Ajusta la ruta según tu estructura de archivos

const Scripts = ({ show, handleCloseScripts, data, loadingScripts }) => {
    return (
        <Modal show={show} onHide={handleCloseScripts} backdrop="static" keyboard={false} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Scripts</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '600px', overflow: 'auto', height: '500px' }}>
                {loadingScripts ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <TDropdownScripts data={data} />
                )}
            </Modal.Body>
        </Modal>
    );
};

export default Scripts; //revisado
