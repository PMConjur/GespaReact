import { Modal } from "react-bootstrap";
import TableTalks from "../../TableTalks";
import TableDeadlines from "../../TableDeadlines";
import { useState, useEffect } from "react";

const Talks = ({ show, handleClose }) => {
    const [selectedTalk, setSelectedTalk] = useState(null);
    const [talksData, setTalksData] = useState([]);

    // Función para manejar cuando TableTalks carga los datos
    const handleTalksDataLoaded = (data) => {
        setTalksData(data);
        // Seleccionar automáticamente la primera fila si hay datos
        if (data && data.length > 0 && !selectedTalk) {
            setSelectedTalk(data[0]);
        }
    };

    // Efecto para asegurar que siempre haya una negociación seleccionada cuando hay datos
    useEffect(() => {
        if (talksData.length > 0 && !selectedTalk) {
            setSelectedTalk(talksData[0]);
        }
    }, [talksData, selectedTalk]);

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            backdrop="static" 
            size="xl"
            keyboard={false}
            contentClassName="d-flex flex-column"
            dialogClassName="my-custom-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-bank me-2"></i>
                    Negociaciones
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex-grow-1 p-0 d-flex">
                <div className="mb-3" style={{ width: "60%", paddingRight: "15px" }}>
                    <TableTalks 
                        onRowClick={setSelectedTalk}
                        onDataLoaded={handleTalksDataLoaded}
                    />
                </div>
                <div style={{ width: "40%" }}>
                <h5>Plazos de la Negociación</h5>
                    <TableDeadlines 
                        selectedTalk={selectedTalk}
                        key={selectedTalk ? `${selectedTalk.Fecha_Insert}_${selectedTalk.Segundo_Insert}` : 'empty'}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Talks;