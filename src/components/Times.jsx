import { useState } from 'react';
import { Modal, Button, Form, Container, Row } from 'react-bootstrap';
import TableTimes from './TableTimes';
import { toast, Toaster } from "sonner";

const Times = ({ show, handleClose }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [timers, setTimers] = useState({
        permiso: 0,
        curso: 0,
        calidad: 0,
        comida: 0,
        baño: 0,
    });
    const [currentTimer, setCurrentTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [password, setPassword] = useState('');
    const [tableTimes, setTableTimes] = useState(() => {
        const savedTimes = JSON.parse(localStorage.getItem('timesData')) || {};
        return {
            permiso: savedTimes.permiso || 0,
            curso: savedTimes.curso || 0,
            calidad: savedTimes.calidad || 0,
            comida: savedTimes.comida || 0,
            baño: savedTimes.baño || 0,
        };
    });
    const [hasSentData, setHasSentData] = useState(false);

    const handleStartTimer = () => {
        if (selectedReason && selectedReason !== 'Selecciona') {
            console.log(`Iniciando temporizador para: ${selectedReason}`);
            setIsPaused(true);
            setCurrentTimer(0); // Reiniciar el contador de pausa
            setHasSentData(false); // Reiniciar el estado de envío
            const newIntervalId = setInterval(() => {
                setCurrentTimer((prevTimer) => prevTimer + 1);
            }, 1000);
            setIntervalId(newIntervalId);
        } else {
            toast.error('Error 400: Por favor seleccione una razón válida.');
        }
    };

    const handleStopTimer = () => {
        console.log(`Intentando detener temporizador para: ${selectedReason}`);
        const correctPassword = "123456789";
        if (!password) {
            toast.error('Error 400: Por favor ingrese la contraseña.');
        } else if (password !== correctPassword) {
            toast.error('Error 401: Contraseña incorrecta');
        } else {
            console.log(`Temporizador detenido para: ${selectedReason}`);
            clearInterval(intervalId);
            setIntervalId(null);
            setIsPaused(false);
            setPassword('');
            setTimers((prevTimers) => {
                const updatedTimers = {
                    ...prevTimers,
                    [selectedReason]: prevTimers[selectedReason] + currentTimer,
                };
                localStorage.setItem('timesData', JSON.stringify(updatedTimers));
                return updatedTimers;
            });
            updateTableTimes();
            if (!hasSentData) {
                sendDataToServer();
                setHasSentData(true);
            }
        }
    };

    const updateTableTimes = () => {
        setTableTimes((prevTableTimes) => {
            const updatedTableTimes = {
                ...prevTableTimes,
                [selectedReason]: prevTableTimes[selectedReason] + currentTimer,
            };
            console.log("Tabla actualizada con los tiempos:", updatedTableTimes);
            return updatedTableTimes;
        });
    };

    const sendDataToServer = () => {
        const dataToSend = {
            numEmpleado: 37940, // Reemplazar con el ID del empleado real
            tiempos: {
                tiempoPermiso: timers.permiso,
                tiempoCurso: timers.curso,
                tiempoCalidad: timers.calidad,
                tiempoComida: timers.comida,
                tiempoBaño: timers.baño,
            }
        };
        console.log("Enviando datos al servidor:", dataToSend);
        // Aquí puedes agregar la lógica para enviar los datos al servidor
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    return (
      <Modal show={show} onHide={isPaused ? null : handleClose} size="xl">
        <Modal.Header closeButton={!isPaused}>
          <Modal.Title>Tiempos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
          <div className="row">
            <div className="col">
              <Form.Group className="input-group mb-3">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleStartTimer}
                  disabled={
                    isPaused ||
                    !selectedReason ||
                    selectedReason === "Selecciona"
                  }
                >
                  Pausar
                </Button>
                <span className="input-group-text"></span>
                <Form.Select
                  aria-label="Default select example"
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  disabled={isPaused}
                >
                  <option>Selecciona</option>
                  <option value="permiso">Permiso</option>
                  <option value="curso">Curso</option>
                  <option value="calidad">Calidad</option>
                  <option value="comida">Comida</option>
                  <option value="baño">Baño</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <hr />
          <Row>
            <div className="col-sm-10">
              <Form.Group className="input-group mb-3">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleStopTimer}
                  disabled={!isPaused}
                >
                  Despausar
                </Button>
                <span className="input-group-text"></span>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isPaused}
                />
              </Form.Group>
            </div>
            <div className="col-sm-2">
              <p>
                {selectedReason.charAt(0).toUpperCase() +
                  selectedReason.slice(1)}{" "}
                : <span>{formatTime(currentTimer)}</span>
              </p>
              <br />
            </div>
          </Row>
          </Container>

          <br />
          <div className="row">
            <div className="col">
              <TableTimes updatedTimes={tableTimes} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isPaused}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default Times;
