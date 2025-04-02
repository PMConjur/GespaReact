import { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { createOnlineCharge } from "../../../services/gespawebServices"; // Se agrega getBancos
import { AppContext } from "../../../pages/Managment";
import { idBanco } from "../../valoresBanco"; // Importar ValoresBanco

const FormOnlineCharge = ({ handleClose }) => {
  const { searchResults } = useContext(AppContext);

  if (!searchResults || searchResults.length === 0) {
    toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
    return null;
  }

  const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

  const [loading, setLoading] = useState(false);
  const [bancos, setBancos] = useState([]); // Bancos obtenidos de la consulta
  const today = new Date().toISOString().split("T")[0]; // Obtener la fecha actual para establecerla como mínima
  const maxVencimiento = new Date();
  maxVencimiento.setFullYear(maxVencimiento.getFullYear() + 20); // Limitar a 20 años más
  const [tipoTarjeta, setTipoTarjeta] = useState("tarjetaCredito"); // Estado local para tipoTarjeta
  const [formData, setFormData] = useState({
    idCartera: 1,
    idCuenta: idCuenta[0]?.trim(),
    idEjecutivo: idEjecutivo,
    tarjeta: "",
    nombre: "",
    vencimiento: today, // Establecer el día actual como valor inicial
    monto: 0,
    idBanco: "",
    esClabe: false,
    domiciliado: false,
    autorizacion: "",
    idEjecutivoAutorizo: idEjecutivo,
    sistema: true,
    status: 1, // Valor por defecto de status es 1 (Acepta)
  });
  const [registroRealizado, setRegistroRealizado] = useState(false); // Estado para controlar si se realizó un registro

  const resetForm = () => {
    setFormData({
      idCartera: 1,
      idCuenta: idCuenta[0]?.trim(),
      idEjecutivo: idEjecutivo,
      tarjeta: "",
      nombre: "",
      vencimiento: today,
      monto: 0,
      idBanco: "",
      esClabe: false,
      domiciliado: false,
      autorizacion: "",
      idEjecutivoAutorizo: idEjecutivo,
      sistema: true,
      status: 1,
    });
    setTipoTarjeta("tarjetaCredito"); // Restablecer tipoTarjeta
  };

  // Obtener los bancos al cargar el componente
  useEffect(() => {
    // Obtener los bancos de la lista ValoresBanco
    const bancosData = Object.entries(idBanco).map(([id, nombre]) => ({
      id,
      nombre,
    }));
    setBancos(bancosData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "tipoTarjeta") {
      setTipoTarjeta(value); // Actualizar solo el estado local de tipoTarjeta
      setFormData({ ...formData, tarjeta: "" }); // Limpiar el campo tarjeta al cambiar el tipo
    } else if (name === "idBanco") {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else if (name === "monto") {
      // Limitar monto a 8 caracteres
      setFormData({
        ...formData,
        monto: value.replace(/[^0-9]/g, "").slice(0, 8),
      });
    } else if (name === "nombre") {
      // Permitir solo letras y espacios, limitar a 120 caracteres
      setFormData({
        ...formData,
        nombre: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 120),
      });
    } else if (name === "vencimiento") {
      const selectedDate = new Date(value);
      if (selectedDate > maxVencimiento) {
        toast.error("La fecha de vencimiento no puede ser mayor a 20 años desde hoy.");
      } else {
        setFormData({ ...formData, vencimiento: value });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos requeridos estén llenos
    if (
      !formData.idCuenta ||
      !formData.tarjeta ||
      !formData.nombre ||
      !formData.vencimiento ||
      !formData.monto ||
      !formData.idBanco ||
      !formData.autorizacion
    ) {
      toast.error("Todos los campos son obligatorios. Por favor, complétalos.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = { 
        ...formData, 
        monto: parseInt(formData.monto, 10) || 0 // Convertir monto a entero
      };

      console.log("Datos a enviar:", dataToSend);

      const response = await createOnlineCharge(dataToSend);
      console.log("Respuesta del endpoint:", response);

      if (response.success) {
        toast.success(response.mensaje || "Cargo en línea guardado exitosamente.");
        setRegistroRealizado(true); // Marcar que se realizó un registro
        resetForm(); // Limpiar el formulario
      } else {
        toast.error(response.mensaje || "Error al enviar el cargo en línea.");
      }
    } catch (error) {
      console.error("Error al realizar el cargo:", error);
      toast.error(error.message || "Ocurrió un error al realizar el cargo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    console.log("Datos a guardar:", formData); // Log de los datos que se intentan guardar

    // Validar que todos los campos requeridos estén llenos
    if (
      !formData.idCuenta ||
      !formData.tarjeta ||
      !formData.nombre ||
      !formData.vencimiento ||
      !formData.monto ||
      !formData.idBanco ||
      !formData.autorizacion
    ) {
      toast.error("Todos los campos son obligatorios. Por favor, complétalos.");
      return;
    }

    try {
      const dataToSend = { 
        ...formData, 
        monto: parseInt(formData.monto, 10) || 0 // Convertir monto a entero
      };

      const response = await createOnlineCharge(dataToSend);
      console.log("Respuesta del envío de datos:", response);

      if (response.success) {
        toast.success(response.mensaje || "Datos guardados exitosamente.");
        setRegistroRealizado(true); // Marcar que se realizó un registro
        resetForm(); // Limpiar el formulario
      } else {
        toast.error(response.mensaje || "Error al guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error); // Log del error
      toast.error(error.message || "Ocurrió un error al guardar los datos.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Opción principal</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={1}>Acepta</option> {/* Valor 1 para "Acepta" */}
              <option value={2}>No acepta</option> {/* Valor 2 para "No acepta" */}
              <option value={3}>Se enviaron documentos</option> {/* Valor 3 para "Se enviaron documentos" */}
            </Form.Select>
          </Form.Group>
        </Col>
        {formData.status === 1 && (
          <Col>
            <Form.Group>
              <Form.Label>Tipo de tarjeta</Form.Label>
              <Form.Select
                name="tipoTarjeta"
                value={tipoTarjeta}
                onChange={handleChange}
              >
                <option value="tarjetaCredito">Tarjeta de crédito</option>
                <option value="clabeInterbancaria">Clabe interbancaria</option>
                <option value="tarjetaEnrolada">Tarjeta enrolada</option>
              </Form.Select>
            </Form.Group>
          </Col>
        )}
      </Row>

      {formData.status === 1 && (
        <>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Tarjeta / Clabe</Form.Label>
                <Form.Control
                  type="text"
                  name="tarjeta"
                  value={formData.tarjeta}
                  onChange={handleChange}
                  maxLength={
                    tipoTarjeta === "tarjetaCredito"
                      ? 16
                      : tipoTarjeta === "clabeInterbancaria"
                      ? 18
                      : 4
                  }
                  placeholder={
                    tipoTarjeta === "tarjetaCredito"
                      ? "Ingrese 16 dígitos"
                      : tipoTarjeta === "clabeInterbancaria"
                      ? "Ingrese 18 dígitos"
                      : "Ultimos 4 Dígitos XXXX"
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
              <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="number"
                  name="monto"
                  value={formData.monto || ""}
                  onChange={handleChange}
                  placeholder="$"
                  maxLength={8} // Limitar a 8 caracteres
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Numero de Autorizacion</Form.Label>
            <Form.Control
              type="number"
              name="autorizacion"
              value={formData.autorizacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  autorizacion: e.target.value.replace(/[^0-9]/g, "").slice(0, 6), // Limitar a 100000
                })
              }
              placeholder="Ingrese un número de referencia"
              max="100000"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tu nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              maxLength={120} // Limitar a 120 caracteres
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Fecha vencimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="vencimiento"
                  value={formData.vencimiento}
                  onChange={handleChange}
                  min={today} // Asegurar que la fecha mínima sea el día actual
                  max={maxVencimiento.toISOString().split("T")[0]} // Limitar a 20 años más
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Check
                type="checkbox"
                name="esClabe"
                label="Es Clabe"
                checked={formData.esClabe}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                name="domiciliado"
                label="Domiciliado"
                checked={formData.domiciliado}
                onChange={handleChange}
              />
            </Col>
          
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Banco</Form.Label>
                <Form.Select
                  name="idBanco"
                  value={formData.idBanco}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un banco</option>
                  {Object.entries(idBanco).map(([id, nombre]) => (
                    <option key={id} value={id}>
                      {nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
                onClick={handleGuardar} // Llamar al método handleGuardar
              >
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Col>
          </Row>
        </>
      )}
      <Button
        variant="secondary"
        onClick={() => {
          if (!registroRealizado) {
            toast.error("Debe realizar al menos un registro antes de cerrar el formulario.");
            return;
          }
          handleClose(); 
        }}
      >
        Cerrar
      </Button>
    </Form>
  );
};

export default FormOnlineCharge;