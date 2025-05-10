import React, { useState, useEffect, useContext } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import FormularioDom from "./FormularioDom";
import TablePostal from "./TablePostal";
import { toast } from "sonner";
import { fetchAddress } from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment"; // Importar el contexto

const Address = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext); // Usar el contexto
  const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null;
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  const [formData, setFormData] = useState({
    calle: "",
    numExt: "",
    numInt: "",
    colonia: "",
    municipio: "",
    estado: "",
    origen: "Gestión",
    fecha: "",
    codigoPostal: "",
  });
  const [domicilioData, setDomicilioData] = useState([]);
  const [postalTableData, setPostalTableData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const idCartera = 1; // ID de cartera fijo

  useEffect(() => {
    if (show) {
      fetchDomicilios();
    }
  }, [show]);

  const fetchDomicilios = async () => {
    try {
      const response = await fetchAddress(idCartera, idCuenta);
      const domicilios = response.domicilios || [];
      setDomicilioData(domicilios);

      if (domicilios.length > 0) {
        const firstDomicilio = domicilios[0];
        setFormData(mapDomicilioToForm(firstDomicilio));
        fetchAndUpdatePostalData(firstDomicilio.idCódigoPostal);
      } else {
        toast.info("No se encontraron domicilios.");
      }
    } catch (error) {
      console.error("Error al obtener domicilios:", error);
      toast.error("No se pudo cargar la información de domicilios.");
    }
  };

  const mapDomicilioToForm = (domicilio) => ({
    calle: domicilio.calle || "",
    numExt: domicilio.númeroExterior || "",
    numInt: domicilio.númeroInterior || "",
    colonia: domicilio.coloniaLocalidad || "",
    municipio: domicilio.delegaciónMunicipio || "",
    estado: domicilio.estado || "",
    origen: domicilio.orígen || "Gestión",
    fecha: domicilio.fecha || "",
    codigoPostal: domicilio.códigoPostal || "",
  });

  const fetchAndUpdatePostalData = async (idCodigoPostal) => {
    try {
      const response = await fetch(`/search-customer/search-postal-code?codigoPostal=${idCodigoPostal}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Respuesta no válida del servidor. Content-Type: ${contentType}`);
      }
      const postalData = await response.json();
      console.log("Respuesta del endpoint de Código Postal:", postalData);

      const match = postalData.codigosPostales?.find(
        (postal) => postal.idCódigoPostal === idCodigoPostal
      );

      if (match) {
        setFormData((prev) => ({
          ...prev,
          codigoPostal: match.códigoPostal || prev.codigoPostal,
          municipio: match.municipio || prev.municipio,
          estado: match.estado || prev.estado,
        }));
        setPostalTableData(postalData.codigosPostales);
        toast.success("Datos del Código Postal actualizados.");
      } else {
        toast.info("No se encontró información para el Código Postal.");
      }
    } catch (error) {
      console.error("Error al obtener datos del Código Postal:", error);
      toast.error("No se pudo cargar la información del Código Postal.");
    }
  };

  const handlePreviousItem = async () => {
    const totalItems = domicilioData.length;
    const newIndex = (currentIndex - 1 + totalItems) % totalItems; // Navegación circular
    setCurrentIndex(newIndex);
    const selectedDomicilio = domicilioData[newIndex];
    setFormData(mapDomicilioToForm(selectedDomicilio));
    await fetchAndUpdatePostalData(selectedDomicilio.idCódigoPostal);

    console.log("Datos del domicilio seleccionado (Anterior):", selectedDomicilio);
  };

  const handleNextItem = async () => {
    const totalItems = domicilioData.length;
    const newIndex = (currentIndex + 1) % totalItems; // Navegación circular
    setCurrentIndex(newIndex);
    const selectedDomicilio = domicilioData[newIndex];
    setFormData(mapDomicilioToForm(selectedDomicilio));
    await fetchAndUpdatePostalData(selectedDomicilio.idCódigoPostal);

    console.log("Datos del domicilio seleccionado (Siguiente):", selectedDomicilio);
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Dirección</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col md={8}>
              <h4>Tabla de Códigos Postales</h4>
              <TablePostal idCodigoPostal={formData.codigoPostal} />
            </Col>
            <Col md={4}>
              <h4>Formulario</h4>
              <FormularioDom
                formData={formData}
                setFormData={setFormData}
                handlePreviousItem={handlePreviousItem}
                handleNextItem={handleNextItem}
                currentIndex={currentIndex}
                totalItems={domicilioData.length}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Address;
