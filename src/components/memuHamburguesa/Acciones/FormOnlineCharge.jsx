import { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { createOnlineCharge } from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";
import { idBanco } from "../../valoresBanco";

const FormOnlineCharge = ({ handleClose, onRegistrationSuccess, setOnlineChargeActive }) => {
    const { searchResults } = useContext(AppContext);
    
    if (!searchResults || searchResults.length === 0) {
        toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
        return null;
    }

    const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

    const [loading, setLoading] = useState(false);
    const [bancos, setBancos] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const maxVencimiento = new Date();
    maxVencimiento.setFullYear(maxVencimiento.getFullYear() + 20);
    const [tipoTarjeta, setTipoTarjeta] = useState("tarjetaCredito");
    const [formData, setFormData] = useState({
        idCartera: 1,
        idCuenta: idCuenta[0]?.trim(),
        idEjecutivo: idEjecutivo,
        tarjeta: "",
        nombre: "",
        vencimiento: today,
        vencimientoMes: today.split("-")[1],
        vencimientoAnio: today.split("-")[0],
        monto: 0,
        idBanco: "",
        esClabe: false,
        domiciliado: false,
        autorizacion: "",
        idEjecutivo_Autorizo: idEjecutivo,
        sistema: true,
        status: 1,
    });

    const resetForm = () => {
        setFormData({
            idCartera: 1,
            idCuenta: idCuenta[0]?.trim(),
            idEjecutivo: idEjecutivo,
            tarjeta: "",
            nombre: "",
            vencimiento: today,
            vencimientoMes: today.split("-")[1],
            vencimientoAnio: today.split("-")[0],
            monto: 0,
            idBanco: "",
            esClabe: false,
            domiciliado: false,
            autorizacion: "",
            idEjecutivo_Autorizo: idEjecutivo,
            sistema: true,
            status: 1,
        });
        setTipoTarjeta("tarjetaCredito");
    };

    useEffect(() => {
        const bancosData = Object.entries(idBanco).map(([id, nombre]) => ({
            id,
            nombre,
        }));
        setBancos(bancosData);
    }, []);

    const validarTarjeta = (tarjeta) => {
        let iSuma = 0;
        
        if (!(tarjeta.startsWith("34") || tarjeta.startsWith("37") || 
              tarjeta.startsWith("5") || tarjeta.startsWith("4") || 
              tarjeta.startsWith("6"))) {
            return false;
        }

        for (let i = 0; i < tarjeta.length; i++) {
            let digito = parseInt(tarjeta.charAt(i), 10);
            
            if ((tarjeta.length - i) % 2 === 0) {
                digito *= 2;
                if (digito > 9) digito -= 9;
            }

            iSuma += digito;
        }

        return iSuma % 10 === 0;
    };

    const formatInput = (value, type) => {
        if (type === "tarjetaCredito") {
            return value
                .replace(/\D/g, "")
                .replace(/(\d{4})(?=\d)/g, "$1-")
                .slice(0, 19);
        } else if (type === "clabeInterbancaria") {
            return value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d{3})(\d{11})(\d{1})/, "$1-$2-$3-$4")
                .slice(0, 23);
        } else if (type === "tarjetaEnrolada") {
            return value.replace(/\D/g, "").slice(0, 4);
        }
        return value;
    };

    const removeSeparators = (value) => {
        return value.replace(/-/g, "");
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "tarjeta") {
            setFormData({
                ...formData,
                tarjeta: formatInput(value, tipoTarjeta),
            });
        } else if (name === "tipoTarjeta") {
            setTipoTarjeta(value);
            setFormData({ ...formData, tarjeta: "" });
        } else if (name === "idBanco") {
            setFormData({ ...formData, [name]: parseInt(value, 10) });
        } else if (name === "monto") {
            setFormData({
                ...formData,
                monto: value.replace(/[^0-9]/g, "").slice(0, 8),
            });
        } else if (name === "nombre") {
            setFormData({
                ...formData,
                nombre: value
                    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
                    .replace(/(.)\1{3,}/g, "$1$1$1")
                    .slice(0, 120),
            });
        } else if (name === "vencimientoMes" || name === "vencimientoAnio") {
            setFormData({
                ...formData,
                [name]: value,
                vencimiento: `${formData.vencimientoAnio}-${formData.vencimientoMes}-01`,
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const validarNombre = (nombre) => {
        if (nombre.length < 5) return true;
        
        const vocales = nombre.match(/[aeiouáéíóú]/gi) || [];
        const proporcionVocales = vocales.length / nombre.length;
        
        if (proporcionVocales < 0.3) return false;
        
        const tieneSecuenciasRepetidas = /([^aeiou]{4,})/gi.test(nombre);
        if (tieneSecuenciasRepetidas) return false;
        
        const caracteresUnicos = new Set(nombre.toLowerCase()).size;
        const proporcionUnicos = caracteresUnicos / nombre.length;
        
        if (proporcionUnicos > 0.7 && nombre.length > 10) return false;
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!formData.idCuenta || !formData.tarjeta || !formData.nombre || 
            !formData.vencimiento || !formData.monto || !formData.idBanco || 
            !formData.autorizacion) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }
            
        const nombreSinEspacios = formData.nombre.replace(/\s/g, '');
        if (nombreSinEspacios.length < 6) {
            toast.error("El nombre debe contener al menos 6 letras (sin contar espacios).");
            return;
        }
        
        if (!validarNombre(formData.nombre)) {
            toast.error("El nombre ingresado no parece válido. Por favor ingrese un nombre real.");
            return;
        }
      
        const tarjetaLimpia = removeSeparators(formData.tarjeta);

        if (tipoTarjeta === "tarjetaCredito" && !validarTarjeta(tarjetaLimpia)) {
            toast.error("Número de tarjeta inválido.");
            return;
        }

        if (tipoTarjeta === "clabeInterbancaria" && tarjetaLimpia.length !== 18) {
            toast.error("La CLABE interbancaria debe tener exactamente 18 dígitos.");
            return;
        }
      
        if (tipoTarjeta === "tarjetaCredito" && validarTarjeta(tarjetaLimpia)) {
            toast.success("Número de tarjeta válido. Procesando cargo...");
        } else if (tipoTarjeta === "clabeInterbancaria") {
            toast.success("CLABE interbancaria válida. Procesando cargo...");
        } else if (tipoTarjeta === "tarjetaEnrolada") {
            toast.success("Tarjeta enrolada válida. Procesando cargo...");
        }
      
        setLoading(true);
      
        try {
          const dataToSend = {
              ...formData,
              tarjeta: tarjetaLimpia,
              monto: parseInt(formData.monto, 10),
              idBanco: parseInt(formData.idBanco, 10)
          };
  
          const response = await createOnlineCharge(dataToSend);
  
          if (response.success) {
              toast.success("Cargo registrado  exitosamente");
              resetForm();
              // Notificar éxito (true) para mostrar el botón cerrar
              handleClose(true);
          }
      } catch (error) {
          toast.error(error.message);
          handleClose(false);
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
                            onChange={(e) => {
                                const newStatus = parseInt(e.target.value, 10);
                                setFormData({ ...formData, status: newStatus });

                                if (newStatus === 1) {
                                    resetForm();
                                }
                            }}
                        >
                            <option value={1}>Acepta</option>
                            <option value={2}>No acepta</option>
                            <option value={3}>Se enviaron documentos</option>
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
                                            ? 19
                                            : tipoTarjeta === "clabeInterbancaria"
                                            ? 21
                                            : 4
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
                                            autorizacion: e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                                        })
                                    }
                                    placeholder="Ingrese un número de referencia"
                                    max="999999"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Titular</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre || ""}
                            onChange={handleChange}
                            placeholder="Ingresa tu nombre"
                            maxLength={120}
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
                                        esClabe: !formData.esClabe,
                                        domiciliado: formData.esClabe ? formData.domiciliado : false,
                                    })
                                }
                                disabled={formData.domiciliado}
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
                                        domiciliado: !formData.domiciliado,
                                        esClabe: formData.domiciliado ? formData.esClabe : false,
                                    })
                                }
                                disabled={formData.esClabe}
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
                                disabled={loading }
                            >
                                {loading  ? "Guardando..." : "Guardar"}
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Form>
    );
};

export default FormOnlineCharge;