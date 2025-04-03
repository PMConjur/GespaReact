import { useState, useContext, useEffect } from "react"; // Importa hooks de React
import { Form, Button, Row, Col } from "react-bootstrap"; // Importa componentes de Bootstrap para formularios
import { toast } from "sonner"; // Importa la librería para mostrar notificaciones
import { createOnlineCharge } from "../../../services/gespawebServices"; // Importa la función para crear un cargo en línea
import { AppContext } from "../../../pages/Managment"; // Importa el contexto de la aplicación
import { idBanco } from "../../valoresBanco"; // Importa los valores de los bancos

// Componente principal del formulario para cargos en línea
const FormOnlineCharge = ({ handleClose }) => {
  // Obtiene los resultados de búsqueda del contexto
  const { searchResults } = useContext(AppContext);

  // Verifica si hay resultados de búsqueda, si no, muestra un error y no renderiza el formulario
  if (!searchResults || searchResults.length === 0) {
    toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
    return null;
  }

  // Extrae el idCuenta de los resultados de búsqueda
  const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
  // Obtiene la información del ejecutivo desde el localStorage
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

  // Estado para manejar la carga y los bancos
  const [loading, setLoading] = useState(false);
  const [bancos, setBancos] = useState([]);
  const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato ISO
  const maxVencimiento = new Date(); // Fecha máxima de vencimiento
  maxVencimiento.setFullYear(maxVencimiento.getFullYear() + 20); // Se establece a 20 años en el futuro
  const [tipoTarjeta, setTipoTarjeta] = useState("tarjetaCredito"); // Estado para el tipo de tarjeta
  const [formData, setFormData] = useState({ // Estado para los datos del formulario
    idCartera: 1,
    idCuenta: idCuenta[0]?.trim(),
    idEjecutivo: idEjecutivo,
    tarjeta: "",
    nombre: "",
    vencimiento: today,
    vencimientoMes: today.split("-")[1], // Mes actual
    vencimientoAnio: today.split("-")[0], // Año actual
    monto: 0,
    idBanco: "",
    esClabe: false,
    domiciliado: false,
    autorizacion: "",
    idEjecutivo_Autorizo: idEjecutivo,
    sistema: true,
    status: 1,
  });

  // Función para restablecer el formulario a su estado inicial
  const resetForm = () => {
    setFormData({
      idCartera: 1,
      idCuenta: idCuenta[0]?.trim(),
      idEjecutivo: idEjecutivo,
      tarjeta: "",
      nombre: "",
      vencimiento: today,
      vencimientoMes: today.split("-")[1], // Mes actual
      vencimientoAnio: today.split("-")[0], // Año actual
      monto: 0,
      idBanco: "",
      esClabe: false,
      domiciliado: false,
      autorizacion: "",
      idEjecutivo_Autorizo: idEjecutivo,
      sistema: true,
      status: 1,
    });
    setTipoTarjeta("tarjetaCredito"); // Restablece el tipo de tarjeta a "tarjetaCredito"
  };

  // Hook para cargar los bancos al montar el componente
  useEffect(() => {
    const bancosData = Object.entries(idBanco).map(([id, nombre]) => ({
      id,
      nombre,
    }));
    setBancos(bancosData); // Establece el estado de bancos
  }, []);

  // Función para validar el número de tarjeta usando el algoritmo de Luhn
  const validarTarjeta = (tarjeta) => {
    let iSuma = 0;
    
    // Verificación de prefijos válidos para tarjetas
    if (
      !(
        tarjeta.startsWith("34") ||
        tarjeta.startsWith("37") ||
        tarjeta.startsWith("5") ||
        tarjeta.startsWith("4") ||
        tarjeta.startsWith("6")
      )
    ) {
      return false; // Retorna false si el prefijo no es válido
    }

    // Aplicación del algoritmo de Luhn
    for (let i = 0; i < tarjeta.length; i++) {
      let digito = parseInt(tarjeta.charAt(i), 10);
      
      if ((tarjeta.length - i) % 2 === 0) {
        digito *= 2; // Duplicar el dígito si está en una posición par
        if (digito > 9) digito -= 9; // Restar 9 si el dígito es mayor que 9
      }

      iSuma += digito; // Sumar el dígito a la suma total
    }

    return iSuma % 10 === 0; // Retorna true si la suma es múltiplo de 10
  };

  // Función para formatear la entrada según el tipo de tarjeta
  const formatInput = (value, type) => {
    if (type === "tarjetaCredito") {
      return value
        .replace(/\D/g, "") // Eliminar caracteres no numéricos
        .replace(/(\d{4})(?=\d)/g, "$1-") // Agregar guiones cada 4 dígitos
        .slice(0, 19); // Limitar a 19 caracteres
    } else if (type === "clabeInterbancaria") {
      return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{11})(\d{1})/, "$1-$2-$3-$4") // Formato de CLABE
        .slice(0, 23); // Limitar a 23 caracteres
    } else if (type === "tarjetaEnrolada") {
      return value.replace(/\D/g, "").slice(0, 4); // Limitar a 4 dígitos
    }
    return value; // Retorna el valor sin cambios si no coincide con ningún tipo
  };

  // Función para eliminar separadores de la entrada
  const removeSeparators = (value) => {
    return value.replace(/-/g, ""); // Eliminar guiones
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Actualiza el estado del formulario según el campo modificado
    if (name === "tarjeta") {
      setFormData({
        ...formData,
        tarjeta: formatInput(value, tipoTarjeta), // Formatea la tarjeta
      });
    } else if (name === "tipoTarjeta") {
      setTipoTarjeta(value); // Cambia el tipo de tarjeta
      setFormData({ ...formData, tarjeta: "" }); // Restablece el campo de tarjeta
    } else if (name === "idBanco") {
      setFormData({ ...formData, [name]: parseInt(value, 10) }); // Establece el banco seleccionado
    } else if (name === "monto") {
      setFormData({
        ...formData,
        monto: value.replace(/[^0-9]/g, "").slice(0, 8), // Limita el monto a 8 dígitos
      });
    } else if (name === "nombre") {
      setFormData({
        ...formData,
        nombre: value
          .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") // Permite solo letras y espacios
          .replace(/(.)\1{3,}/g, "$1$1$1") // Limita a 3 caracteres repetidos
          .slice(0, 120), // Limita a 120 caracteres
      });
    } else if (name === "vencimientoMes" || name === "vencimientoAnio") {
      setFormData({
        ...formData,
        [name]: value,
        vencimiento: `${formData.vencimientoAnio}-${formData.vencimientoMes}-01`, // Actualiza la fecha completa
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value, // Maneja checkbox y otros campos
      });
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
  
    // Validaciones de campos obligatorios
    if (!formData.idCuenta || !formData.tarjeta || !formData.nombre || 
        !formData.vencimiento || !formData.monto || !formData.idBanco || 
        !formData.autorizacion) {
      toast.error("Todos los campos son obligatorios."); // Muestra un error si falta algún campo
      return;
    }
  
    const tarjetaLimpia = removeSeparators(formData.tarjeta); // Elimina separadores de la tarjeta

    if (tipoTarjeta === "tarjetaCredito" && !validarTarjeta(tarjetaLimpia)) {
      toast.error("Número de tarjeta inválido."); // Valida el número de tarjeta
      return;
    }

    if (tipoTarjeta === "clabeInterbancaria" && tarjetaLimpia.length !== 18) {
      toast.error("La CLABE interbancaria debe tener exactamente 18 dígitos."); // Valida la longitud de la CLABE
      return;
    }
  
    // Mensajes de éxito según el tipo de tarjeta
    if (tipoTarjeta === "tarjetaCredito" && validarTarjeta(tarjetaLimpia)) {
      toast.success("Número de tarjeta válido. Procesando cargo...");
    } else if (tipoTarjeta === "clabeInterbancaria") {
      toast.success("CLABE interbancaria válida. Procesando cargo...");
    } else if (tipoTarjeta === "tarjetaEnrolada") {
      toast.success("Tarjeta enrolada válida. Procesando cargo...");
    }
  
    setLoading(true); // Establece el estado de carga a true
  
    try {
      const dataToSend = {
        ...formData,
        tarjeta: tarjetaLimpia, // Envía la tarjeta limpia
        monto: parseInt(formData.monto, 10), // Convierte el monto a número
        idBanco: parseInt(formData.idBanco, 10) // Convierte el idBanco a número
      };
  
      const response = await createOnlineCharge(dataToSend); // Llama a la función para crear el cargo en línea
  
      if (response.success) {
        toast.success("Cargo registrado exitosamente"); // Muestra un mensaje de éxito
        resetForm(); // Restablece el formulario
        if (handleClose) handleClose(); // Cierra el formulario si se proporciona la función 
      }
    } catch (error) {
      toast.error(error.message); // Muestra el mensaje de error
    } finally {
      setLoading(false); // Establece el estado de carga a false
    }
  };

  // Renderiza el formulario
  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Opción principal</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={(e) => {
                const newStatus = parseInt(e.target.value, 10);
                setFormData({ ...formData, status: newStatus });

                // Mostrar el formulario si se selecciona "Acepta"
                if (newStatus === 1) {
                  resetForm(); // Restablecer el formulario
                }
              }}
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
                      ? 19 // 16 dígitos + 3 guiones
                      : tipoTarjeta === "clabeInterbancaria"
                      ? 21 // 18 dígitos + 5 guiones
                      : 4 // 4 dígitos
                  }
                  placeholder={
                    tipoTarjeta === "tarjetaCredito"
                      ? "XXXX-XXXX-XXXX-XXXX"
                      : tipoTarjeta === "clabeInterbancaria"
                      ? "XXX-XXX-XXXXXXXXXXX-X"
                      : "XXXX"
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
                  max="99999999"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Mes de vencimiento</Form.Label>
                <Form.Select
                  name="vencimientoMes"
                  value={formData.vencimientoMes}
                  onChange={handleChange}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0");
                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Año de vencimiento</Form.Label>
                <Form.Select
                  name="vencimientoAnio"
                  value={formData.vencimientoAnio}
                  onChange={handleChange}
                >
                  {Array.from({ length: 21 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>No. Autorización</Form.Label>
                <Form.Control
                  type="number"
                  name="autorizacion"
                  value={formData.autorizacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      autorizacion: e.target.value.replace(/[^0-9]/g, "").slice(0, 6), // Limitar a 6 dígitos
                    })
                  }
                  placeholder="Ingrese un número de referencia"
                  max="999999"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
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
              <Form.Check
                type="checkbox"
                name="esClabe"
                label="Es Clabe"
                checked={formData.esClabe}
                onChange={() =>
                  setFormData({
                    ...formData,
                    esClabe: !formData.esClabe, // Alternar el estado de "esClabe"
                    domiciliado: formData.esClabe ? formData.domiciliado : false, // Deshabilitar "domiciliado" si "esClabe" se activa
                  })
                }
                disabled={formData.domiciliado} // Deshabilitar si "domiciliado" está activo
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                name="domiciliado"
                label="Domiciliado"
                checked={formData.domiciliado}
                onChange={() =>
                  setFormData({
                    ...formData,
                    domiciliado: !formData.domiciliado, // Alternar el estado de "domiciliado"
                    esClabe: formData.domiciliado ? formData.esClabe : false, // Deshabilitar "esClabe" si "domiciliado" se activa
                  })
                }
                disabled={formData.esClabe} // Deshabilitar si "esClabe" está activo
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
                disabled={loading} // Deshabilita el botón si está cargando
              >
                {loading ? "Guardando..." : "Guardar"} 
                {/* // Cambia el texto del botón según el estado de carga */}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

export default FormOnlineCharge; // Exporta el componente para su uso en otras partes de la aplicación