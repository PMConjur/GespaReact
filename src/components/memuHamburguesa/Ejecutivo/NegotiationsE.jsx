import { useState, useEffect } from "react";
import { Modal, Container } from "react-bootstrap";
import { toast } from "sonner";
import { fetchNegotiationsData } from "../../../services/gespawebServices";
import TableNegotiationsMonth from "../../TableNegotiationsMonth";

const Negotiations = ({ show, handleClose }) => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateidEjecutivo = (id) => {
    return (
      (typeof id === "string" && id.trim() !== "") ||
      (typeof id === "number" && !isNaN(id))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!validateidEjecutivo(idEjecutivo)) {
        const errorText =
          "Error 400: Por favor ingrese un ID de cuenta válido.";
        if (errorMessage !== errorText) {
          toast.error(errorText);
          setErrorMessage(errorText);
        }
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchNegotiationsData(idEjecutivo);
        setTableData(data);
      } catch (error) {
        toast.dismiss();
        toast.error(error.message);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show, idEjecutivo, errorMessage]);

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Negociaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <hr />
          {isLoading ? (
            <p>Cargando datos...</p>
          ) : (
            <TableNegotiationsMonth tableData={tableData} />
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Negotiations;
