import { useState } from 'react';
import { Modal, Button, Form, Container, Row } from 'react-bootstrap';
import TableTimes from './TableTimes';
import { toast, Toaster } from "sonner";
import axios from 'axios';
import { userTimesUpdate } from "../services/gespawebServices"; // Asegúrate de importar la función


const Times = ({ show, handleClose }) => {
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    console.log("Datos almacenados en localStorage:", responseData);
    const numEmpleado = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
    const registeredPassword = responseData?.ejecutivo?.infoEjecutivo?.password?.trim(); // Obtener la contraseña registrada para el numEmpleado y eliminar espacios en blanco
    const userPassword = responseData?.ejecutivo?.infoEjecutivo?.password;
    console.log("La contraseña es:" + userPassword)
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


    const handleStopTimer = async () => {
        console.log(`Intentando detener temporizador para: ${selectedReason}`);
        console.log(`Contraseña ingresada: '${password.trim()}'`);
        console.log(`Contraseña registrada: '${registeredPassword}'`);
    
        if (!password) {
            toast.error('Error 400: Por favor ingrese la contraseña.');
            return;
        } else if (password.trim() !== registeredPassword) {
            toast.error('Error 401: Contraseña incorrecta');
            return;
        }
    
        console.log(`✅ Temporizador detenido para: ${selectedReason}`);
        clearInterval(intervalId);
        setIntervalId(null);
        setIsPaused(false);
        setPassword('');
    
        setTimers((prevTimers) => {
            const updatedTimers = {
                ...prevTimers,
                [selectedReason]: (prevTimers[selectedReason] || 0) + currentTimer,
            };
    
            localStorage.setItem('timesData', JSON.stringify(updatedTimers));
            console.log("📌 Tiempos actualizados en localStorage:", updatedTimers);
    
            updateTableTimes(updatedTimers);
    
            // ✅ Llamada a userTimesUpdate para enviar los datos
            const tiempoTotal = updatedTimers[selectedReason] || 0;
            const duracion = new Date(tiempoTotal * 1000).toISOString().substr(11, 8);
    
            const dataToSend = {
                idEjecutivo: numEmpleado,
                contrasenia: registeredPassword,
                peCausa: selectedReason,
                duracion: duracion, // Formato "hh:mm:ss"
            };
    
            userTimesUpdate(dataToSend);
    
            return updatedTimers;
        });
    
        setCurrentTimer(0);
    };
    
  

  const updateTableTimes = (updatedTimers) => {
    setTableTimes((prevTableTimes) => {
        const updatedTableTimes = {
            ...prevTableTimes,
            ...updatedTimers, // Se aseguran los valores correctos
        };
        console.log("📌 Tabla actualizada con los tiempos:", updatedTableTimes);
        return updatedTableTimes;
    });
};



const sendDataToServer = async (updatedTimers) => {
  if (!numEmpleado || !registeredPassword || !selectedReason) {
      toast.error("Faltan datos para enviar la pausa.");
      return;
  }

  const tiempoTotal = updatedTimers[selectedReason] || 0; 
  const duracion = new Date(tiempoTotal * 1000).toISOString().substr(11, 8); 

  const dataToSend = {
      idEjecutivo: numEmpleado,
      contrasenia: registeredPassword,
      peCausa: selectedReason,
      duracion: duracion // Formato "hh:mm:ss"
      
  };

  console.log("📤 Enviando datos actualizados al servidor:", JSON.stringify(dataToSend, null, 2));

  try {
      const response = await axios.post(
          "http://192.168.7.33/api/ejecutivo/pause-ejecutivo",
          dataToSend
      );

      console.log("✅ Respuesta de la API:", response.data);
      toast.success("Datos enviados correctamente a la base de datos.");
  } catch (error) {
      console.error("❌ Error al enviar los datos:", error);
      toast.error("Error al enviar los tiempos al servidor.");
  }
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