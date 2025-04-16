import { useState, useEffect } from "react";
import { fetchNotes } from "../services/gespawebServices";
import servicio from "../services/axiosServices";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import "../scss/styles.scss";

const responseData = JSON.parse(localStorage.getItem("responseData"));
const numEmpleado = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
const token = servicio;

const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
  </svg>
);

function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [approach, setApproach] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [option, setOption] = useState("");

  // Cargar notas desde un endpoint al iniciar
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await fetchNotes(numEmpleado, token);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 404) {
          // alert(
          //    "No se encontraron Recordatorios para el ID de empleado proporcionado."
          //  );
        } else {
          //  alert(
          //    "Se produjo un error al recuperar Recordatorios. Por favor inténtalo de nuevo más tarde.."
          //  );
        }
      }
    };

    loadNotes();
  }, [numEmpleado, token]);

  // Validar la fecha y hora de seguimiento
  useEffect(() => {
    const checkFollowUpTime = () => {
      const currentDate = new Date();
      console.log("Checking follow-up time at:", currentDate);

      notes.forEach((note) => {
        if (note.time && note.date) {
          // Verificar que note.time y note.date no sean undefined
          const [hours, minutes] = note.time.split(":").map(Number);
          const [day, month, year] = note.date.split("/").map(Number); // formato dd/MM/yyyy
          const followUpDateTime = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes
          );

          console.log("Current date:", currentDate);
          console.log("Follow-up date:", followUpDateTime);

          if (
            currentDate.getFullYear() === followUpDateTime.getFullYear() &&
            currentDate.getMonth() === followUpDateTime.getMonth() &&
            currentDate.getDate() === followUpDateTime.getDate() &&
            currentDate.getHours() === followUpDateTime.getHours() &&
            currentDate.getMinutes() === followUpDateTime.getMinutes()
          ) {
            alert(`¡Es hora de seguimiento para la nota: ${note.title}!`);
          }
        }
      });
    };

    // Comprobar cada minuto
    const intervalId = setInterval(checkFollowUpTime, 60000);
    return () => clearInterval(intervalId); // Limpiar intervalo cuando el componente se desmonte
  }, [notes]);

  // Guardar notas en el endpoint cuando cambian
  useEffect(() => {
    const saveNotes = async () => {
      try {
        await fetch(
          "http://192.168.7.33/api/ejecutivo/recordatorios/${idEjecutivo}",
          {
            method: "Get",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notes),
          }
        );
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    };

    if (notes.length > 0) {
      saveNotes();
    }
  }, [notes]);

  const handleAddNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
    setApproach("");
    setDate(new Date());
    setTime("");
    setOption("");
    setIsEditing(true);
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setApproach(note.approach);
    setDate(new Date(note.date));
    setTime(note.time);
    setOption(note.option);
    setIsEditing(true);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return;

    const dateString = date.toLocaleDateString();
    const dateTime = `${dateString} ${time}`;

    if (activeNote) {
      // Actualizar nota existente
      const updatedNotes = notes.map((note) =>
        note.id === activeNote.id
          ? { ...note, title, content, approach, date: dateTime, time, option }
          : note
      );
      setNotes(updatedNotes);
    } else {
      // Crear nueva nota
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        approach,
        date: dateTime,
        time,
        option,
      };
      setNotes([newNote, ...notes]);
    }

    setIsEditing(false);
    setTitle("");
    setContent("");
    setApproach("");
    setDate(new Date());
    setTime("");
    setOption("");
    setActiveNote(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle("");
    setContent("");
    setApproach("");
    setDate(new Date());
    setTime("");
    setOption("");
    setActiveNote(null);
  };

  // Función actualizada para verificar si la fecha ya pasó
  const isDateInPast = (isoDateString) => {
    if (!isoDateString) return true;
    
    try {
      const noteDate = new Date(isoDateString);
      const now = new Date();
      return noteDate < now;
    } catch (error) {
      console.error("Error al parsear fecha:", error);
      return true;
    }
  };

  return (
    <div  className="notes-widget card shadow">
      <div style={{}} className="card-header text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Mis Recordatorios</h5>
        {/* 
        <button
          className="btn btn-sm btn-light"
          onClick={handleAddNote}
          aria-label="Añadir nota"
        >
          <PlusIcon />
        </button>
        */}
      </div>
      <div className="card-body">
        {isEditing ? (
          <div className="edit-area">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={5}
                placeholder="Contenido de la nota..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
              >
                <option value="">Selecciona un acercamiento</option>
                <option value="acercamiento1">Telefonico</option>
                <option value="acercamiento2">Email</option>
              </select>
            </div>
            <div className="mb-3">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="mb-3" style={{ width: "100%" }}>
              <label htmlFor="timePicker">Hora -- Minutos</label>
              <TimePicker
                id="timePicker"
                onChange={setTime}
                value={time}
                className="custom-time-picker"
                disableClock={true}
                clearIcon={null}
                format="h m a" // Solo muestra la hora y AM/PM
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={option}
                onChange={(e) => setOption(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option value="4303"> Se corto la llamada</option>
                <option value="4402">Seguimiento llamada</option>
                <option value="4403"> Solicitud titular</option>
                <option value="4404">Se realizara PEX</option>
                <option value="opcion1"> No puede atender</option>
                <option value="4406">Reportara pago</option>
                <option value="4407"> Cierre de gestion</option>
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button
                className="btn btn-primary d-flex align-items-center gap-1"
                onClick={handleSaveNote}
              >
                <SaveIcon /> Guardar
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-list">
            {notes.length === 0 ? (
              <div className="text-center text-muted py-5 mb-0 text-white">
                <p className="text-white">No hay Recordatorio.</p>
                {/* 
                <button className="btn btn-primary" onClick={handleAddNote}>
                <PlusIcon /> <span className="ms-1">Nuevo Recordatorio</span>
                </button> 
                */}
              </div>
            ) : (
              <div
                className="list-group overflow-auto"
                style={{ maxHeight: "auto",}}
              >
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-2">{note.title || "Sin título"}</h6>
                      <div>
                        {/* <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEditNote(note)}
                          aria-label="Editar nota"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteNote(note.id)}
                          aria-label="Eliminar nota"
                        >
                          <TrashIcon />
                        </button> */}
                      </div>
                    </div>
                    <span style={{whiteSpace: 'none'}} className="mb-1">{note.content || "Sin contenido"}</span>
                    
                    {/* Botón Realizar condicional - versión corregida */}
                    {note.date && !isDateInPast(note.date) && (
                      <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" size="sm">
                          Realizar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesWidget;