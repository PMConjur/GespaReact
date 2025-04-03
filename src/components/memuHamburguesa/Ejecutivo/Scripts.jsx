
import { Modal, Button, Spinner } from "react-bootstrap";
import TDropdownScripts from "../../TDropdownScripts"; // Ajusta la ruta según tu estructura de archivos

const Scripts = ({ show, handleCloseScripts, data, loadingScripts }) => {
    return (
        <Modal show={show} onHide={handleCloseScripts} size="xl" centered>
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
            <Modal.Footer style={{ padding: '1rem 2rem' }}>
                <Button variant="secondary" onClick={handleCloseScripts}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Scripts;
