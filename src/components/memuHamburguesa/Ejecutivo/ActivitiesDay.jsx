import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "sonner";
import { fetchGestionesDelDia } from "../../../services/gespawebServices";

import Tableefforts from "../../Tableefforts";
import Tabledailymanagement from "../../Tabledailymanagement";

const ActivityDay = ({ show, handleClose }) => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  const [cuentasData, setCuentasData] = useState([]);
  const [gestionesData, setGestionesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await fetchGestionesDelDia(idEjecutivo, setErrorMessage);
          setCuentasData(data.Cuentas || []);
          setGestionesData(data.GestionesEjecutivo || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [show, idEjecutivo]);

  const handleRowClick = (item) => {
    setSelectedGestion(item);
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Gestiones Diarias</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabledailymanagement cuentasData={cuentasData} />
        <Tableefforts
          gestionesData={gestionesData}
          handleRowClick={handleRowClick}
          selectedGestion={selectedGestion}
        />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ActivityDay;
