import { useState, useEffect, useMemo, useContext } from "react";
import { fetchNotes, saveNotesToAPI } from "../services/gespawebServices";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import "../scss/styles.scss";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";
import { BellFill } from "react-bootstrap-icons";

const responseData = JSON.parse(localStorage.getItem("responseData"));
const numEmpleado = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
console.log("numEmpleado", numEmpleado);

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
  const { formData } = useContext(AppContext);
  const { selectedDate } = useContext(AppContext);
  const [filteredNotes, setFilteredNotes] = useState([]);

  // Función para filtrar notas por la fecha seleccionada
  const filterNotesBySelectedDate = (notes, selectedDate) => {
    if (!selectedDate) return notes; // Si no hay fecha seleccionada, mostrar todas las notas

    // Convertir la fecha seleccionada a formato YYYY-MM-DD
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    return notes.filter((note) => {
      // Asegurarse de que la fecha de la nota esté en el mismo formato
      const noteDate = note.date?.includes("/")
        ? convertToISODate(note.date)
        : note.date?.split("T")[0];
      return noteDate === selectedDateString;
    });
  };

  // Función para convertir fechas en formato DD/MM/YYYY a YYYY-MM-DD
  const convertToISODate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day).toISOString().split("T")[0];
  };

  useEffect(() => {
    // Filtrar notas futuras primero
    const futureNotes = filterNotesBySelectedDate(notes, selectedDate)
      .filter(note => shouldDisplayNote(note, false));
    
    if (futureNotes.length > 0) {
      // Si hay notas futuras, mostrarlas
      const sorted = sortNotesByDateTime(futureNotes);
      setFilteredNotes(sorted);
    } else {
      // Si no hay notas futuras, mostrar historial de hoy
      const todayHistory = filterNotesBySelectedDate(notes, new Date())
        .filter(note => shouldDisplayNote(note, true));
      
      const sortedHistory = sortNotesByDateTime(todayHistory).reverse(); // Más reciente primero
      setFilteredNotes(sortedHistory);
    }
  }, [notes, selectedDate]);
  // Cargar notas cuando cambia numEmpleado o formData
  useEffect(() => {
    const loadNotes = async () => {
      try {
        console.log("Cargando notas...", { numEmpleado, formData });
        const fetchedNotes = await fetchNotes(numEmpleado);

        // Asegurar que cada nota tenga un ID único
        const notesWithUniqueIds = fetchedNotes.map((note, index) => ({
          ...note,
          id: note.id || `note-${Date.now()}-${index}`, // Generar ID si no existe
          uniqueKey: `${note.idCuenta?.trim()}-${note.FechaPago}-${
            note.segundo
          }-${index}`, // Clave única compuesta
        }));

        setNotes(notesWithUniqueIds);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response?.status === 404) {
          console.log("No se encontraron recordatorios");
        } else {
          toast.error("Error al cargar los recordatorios");
        }
      }
    };

    if (numEmpleado) {
      loadNotes();
    }
  }, [numEmpleado, formData?.datoContacto]);

  // Validar la fecha y hora de seguimiento
  useEffect(() => {
    const checkFollowUpTime = () => {
      const currentDate = new Date();

      notes.forEach((note) => {
        if (note.time && note.date) {
          const [hours, minutes] = note.time.split(":").map(Number);
          const [day, month, year] = note.date.split("/").map(Number);
          const followUpDateTime = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes
          );

          if (
            currentDate.getFullYear() === followUpDateTime.getFullYear() &&
            currentDate.getMonth() === followUpDateTime.getMonth() &&
            currentDate.getDate() === followUpDateTime.getDate() &&
            currentDate.getHours() === followUpDateTime.getHours() &&
            currentDate.getMinutes() === followUpDateTime.getMinutes()
          ) {
            toast.warning(`¡Es hora de seguimiento para la nota: ${note.title}!`);
          }
        }
      });
    };

    const intervalId = setInterval(checkFollowUpTime, 60000);
    return () => clearInterval(intervalId);
  }, [notes]);

  // Guardar notas en el endpoint cuando cambian
  useEffect(() => {
    const handleSaveNotes = async () => {
      try {
        await saveNotesToAPI(notes);
      } catch (error) {
        console.error("Error en el guardado de notas:", error);
        // Puedes agregar notificaciones al usuario aquí si lo deseas
      }
    };

    if (notes.length > 0) {
      handleSaveNotes();
    }
  }, [notes]);

  // Función para ordenar notas por fecha y hora más próxima
  const sortNotesByDateTime = (notes) => {
    return [...notes].sort((a, b) => {
      try {
        // Crear fechas comparables para ambas notas
        const getComparableDate = (note) => {
          if (!note.date) return new Date(0); // Fecha muy antigua si no hay fecha
          
          // Parsear fecha según formato
          let dateObj;
          if (note.date.includes('T')) {
            dateObj = new Date(note.date);
          } else {
            const [day, month, year] = note.date.split('/').map(Number);
            dateObj = new Date(year, month - 1, day);
          }
          
          // Si tiene hora, agregarla
          if (note.time) {
            const [hours, minutes] = note.time.split(':').map(Number);
            dateObj.setHours(hours, minutes, 0, 0);
          }
          
          return dateObj;
        };
  
        const dateA = getComparableDate(a);
        const dateB = getComparableDate(b);
  
        // Orden ascendente (más próximo primero)
        return dateA - dateB;
      } catch (error) {
        console.error("Error al ordenar notas:", error);
        return 0;
      }
    });
  };

  // Notas ordenadas memoizadas

  const sortedNotes = useMemo(
    () => sortNotesByDateTime(filteredNotes),
    [filteredNotes]
  );
  // Función para extraer número de teléfono
  const extractFullPhoneNumber = (content) => {
    if (!content) return null;
    const phoneMatch = content.match(/\b\d{10}\b/);
    return phoneMatch ? phoneMatch[0] : null;
  };

  // Manejar clic en Realizar
  const handleRealizarClick = (note) => {
    try {
      const phoneNumber = extractFullPhoneNumber(note.content);

      if (!phoneNumber) {
        toast.warning("No se encontró número de teléfono válido");
        return;
      }

      const phoneLinks = document.querySelectorAll(
        "a.text-info[data-full-number]"
      );
      let foundPhone = null;

      phoneLinks.forEach((link) => {
        const fullNumber = link.getAttribute("data-full-number");
        if (fullNumber === phoneNumber) {
          foundPhone = link;
        }
      });

      if (foundPhone) {
        foundPhone.click();
        toast.success(`Llamando a: ${"XXXXXX" + phoneNumber.slice(-4)}`);
      } else {
        toast.error(
          `Número no encontrado: ${"XXXXXX" + phoneNumber.slice(-4)}`
        );
      }
    } catch (error) {
      console.error("Error en handleRealizarClick:", error);
      toast.error("Error al procesar el recordatorio");
    }
  };

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
      const updatedNotes = notes.map((note) =>
        note.id === activeNote.id
          ? { ...note, title, content, approach, date: dateTime, time, option }
          : note
      );
      setNotes(updatedNotes);
    } else {
      const newNote = {
        id: `note-${Date.now()}`,
        title,
        content,
        approach,
        date: dateTime,
        time,
        option,
        uniqueKey: `note-${Date.now()}-${notes.length}`, // Clave única para renderizado
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

  const shouldDisplayNote = (note, showPastNotes = false) => {
    if (!note.date) return false;
    
    try {
      const dateObj = note.date.includes('T') 
        ? new Date(note.date)
        : new Date(note.date.split('/').reverse().join('-'));
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isToday = dateObj.setHours(0, 0, 0, 0) === today.getTime();
  
      if (showPastNotes) {
        // Lógica existente para historial
        return isToday && (!note.time || new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          ...(note.time ? note.time.split(':').map(Number) : [0, 0])
        ) < new Date());
      } else {
        // Para notas futuras/activas
        if (!note.time) {
          return dateObj >= today;
        }
        
        const [hours, minutes] = note.time.split(':').map(Number);
        dateObj.setHours(hours, minutes, 0, 0);
        
        // Mostrar nota 5 minutos antes y después
        const fiveMinutesMs = 5 * 60 * 1000;
        return dateObj.getTime() + fiveMinutesMs >= new Date().getTime();
      }
    } catch (error) {
      console.error("Error al parsear fecha:", note.date, error);
      return false;
    }
  };

  const isWithinFiveMinutes = (note) => {
    if (!note.time || !note.date) return false;
    
    try {
      const [day, month, year] = note.date.split('/').map(Number);
      const [hours, minutes] = note.time.split(':').map(Number);
      
      const noteDateTime = new Date(year, month - 1, day, hours, minutes);
      const currentTime = new Date();
      const fiveMinutesMs = 5 * 60 * 1000;
      
      return Math.abs(noteDateTime - currentTime) <= fiveMinutesMs;
    } catch (error) {
      console.error("Error al verificar tiempo de seguimiento:", error);
      return false;
    }
  };

  useEffect(() => {
    console.log("Notas filtradas:", filteredNotes.map(n => ({
      title: n.title,
      date: n.date,
      time: n.time,
      shouldShow: shouldDisplayNote(n)
    })));
  }, [filteredNotes]);

  const formatPhoneNumber = (text) => {
    if (!text) return text;
    
    // Busca números de 10 dígitos en el texto
    return text.replace(/\b\d{10,13}\b/g, (phone) => {
      return 'XXXXXX' + phone.slice(-4);
    });
  };

  const formatAccountId = (id, isHistory = false) => {
    if (!id) return id;
    return isHistory ? `${id.slice(-5)}` : id;
  };

  return (
    <div className="notes-widget card shadow">
      <div
        style={{}}
        className="card-header text-white d-flex justify-content-between align-items-center"
      >
        <h5 className="mb-0 gap-3">
          <BellFill className=" me-1" />
          Mis Recordatorios
        </h5>
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
            {filteredNotes.length === 0 ? (
              <div className="text-center text-muted py-5 mb-0 text-white">
                <p className="text-white">
                  No hay recordatorios para la fecha seleccionada.
                </p>
              </div>
            ) : (
              <div
                className="list-group overflow-auto"
                style={{ maxHeight: "400px" }}
              >
                {filteredNotes.map((note, index) => {
                  const isFutureNote = shouldDisplayNote(note, false);
                  const isHistoryNote = !isFutureNote;
                  const shouldAnimate = isFutureNote && isWithinFiveMinutes(note);
                  const isClosestNote = isFutureNote && index === 0;
                  return (
                    <div
                      key={note.uniqueKey || note.id}
                      className={`list-group-item list-group-item-action ${
                        shouldAnimate ? "blinking-border" : ""
                      } ${!isFutureNote ? "opacity-50" : ""}`} // Reducir opacidad para notas pasadas
                    >
                      <div className="d-flex justify-content-between align-items-center overflow-auto">
                        <span className="mb-2 mt-2 text-nowrap">
                        {note.title || "Sin título"} / Hora:{note.time} / Cuenta:{formatAccountId(note.id, isHistoryNote)} / {formatPhoneNumber(note.content) || "Sin contenido"}
                      
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        {shouldAnimate && note.date && (
                          <span className="shake-animation">
                            SEGUIMIENTO PENDIENTE
                          </span>
                        )}
                        {isClosestNote && isFutureNote && note.date && (
                          <Button
                            className="mt-2 btn-success justify-content-end ms-auto"
                            onClick={() => handleRealizarClick(note)}
                          >
                            Realizar
                          </Button>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default NotesWidget;
