// filepath: c:\Users\Alan De La O\Documents\GespaTra\GespaReact\src\components\memuHamburguesa\Acciones\FormOnlineCharge.jsx
import { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { createOnlineCharge } from "../../../services/gespawebServices"; // Se agrega getBancos
import { AppContext } from "../../../pages/Managment";

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
  const [formData, setFormData] = useState({
    idCuenta: idCuenta[0]?.trim(),
    idEjecutivo: idEjecutivo,
    idCartera: 1,
    status: "Acepta",
    tipoTarjeta: "tarjetaCredito", // Selección predeterminada
    tarjeta: "",
    nombre: "",
    tuNombre: "", // Campo adicional
    vencimiento: "",
    monto: "",
    banco: "",
    autorizacion: "",
    esClabe: false,
    domiciliado: false,
  });

  // Obtener la fecha actual para establecerla como mínima
  const today = new Date().toISOString().split("T")[0];

  // Obtener los bancos al cargar el componente
  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const bancosData = await getBancos();
        setBancos(bancosData);
      } catch (error) {
        console.error("Error al obtener los bancos:", error);
      }
    };
    fetchBancos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpiar el campo tarjeta al cambiar el tipo de tarjeta
    if (name === "tipoTarjeta") {
      setFormData({ ...formData, tarjeta: "", [name]: value });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createOnlineCharge(formData);
      if (response.success) {
        toast.success("Cargo en línea realizado con éxito.");
        handleClose();
      } else {
        throw new Error(response.message || "Error desconocido.");
      }
    } catch (err) {
      toast.error(`Error al realizar el cargo: ${err.message}`);
    } finally {
      setLoading(false);
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
              <option value="Acepta">Acepta</option>
              <option value="No acepta">No acepta</option>
              <option value="Se enviaron documentos">Se enviaron documentos</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {formData.status === "Acepta" && (
          <Col>
            <Form.Group>
              <Form.Label>Tipo de tarjeta</Form.Label>
              <Form.Select
                name="tipoTarjeta"
                value={formData.tipoTarjeta}
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

      {formData.status === "Acepta" && (
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
                    formData.tipoTarjeta === "tarjetaCredito"
                      ? 16
                      : formData.tipoTarjeta === "clabeInterbancaria"
                      ? 18
                      : 4
                  }
                  placeholder={
                    formData.tipoTarjeta === "tarjetaCredito"
                      ? "Ingrese 16 dígitos"
                      : formData.tipoTarjeta === "clabeInterbancaria"
                      ? "Ingrese 18 dígitos"
                      : "Ultimos 4 Digitos XXXX"
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="text"
                  name="monto"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto: e.target.value.replace(/[^0-9.]/g, ""),
                    })
                  }
                  placeholder="$"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Nombre titular</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tu nombre</Form.Label>
            <Form.Control
              type="text"
              name="tuNombre"
              value={formData.tuNombre || ""}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
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
                  min={today} // Fecha mínima
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
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un banco</option>
                  {bancos.map((banco) => (
                    <option key={banco.id} value={banco.nombre}>
                      {banco.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

export default FormOnlineCharge;