
import { Modal, Button, Spinner } from "react-bootstrap";
import TDropdownProcessesWLP from "../../TDropdownProcessesWLP"; // Ajusta la ruta según tu estructura de archivos

const ProcessesWLP = ({ show, handleCloseProcessesWLP, data, loadingProcessesWLP, Proceso }) => {
    console.log("Datos recibidos en el modal ProcessesWLP:", { data, loadingProcessesWLP, Proceso });

    return (
        <Modal show={show} onHide={handleCloseProcessesWLP} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Procesos WLP</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '600px', overflow: 'auto', height: '500px' }}>
                {loadingProcessesWLP ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <TDropdownProcessesWLP data={data} Proceso={Proceso} />
                )}
            </Modal.Body>
            <Modal.Footer style={{ padding: '1rem 2rem' }}>
                <Button variant="secondary" onClick={handleCloseProcessesWLP}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProcessesWLP;
