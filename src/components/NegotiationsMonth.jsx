import { useEffect, useState, useContext } from "react";
import { Table, Card } from "react-bootstrap";
import { userNegotiations, searchCustomer } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast, Toaster } from "sonner";

const NegotiationsMonth = () => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = 14126; //responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const [negotiations, setNegotiations] = useState([]);
  const { setSearchResults } = useContext(AppContext);

  useEffect(() => {
    if (idEjecutivo) {
      userNegotiations(idEjecutivo).then((data) => {
        setNegotiations(data.negociaciones);
        console.log(data);
      });
    }
  }, [idEjecutivo]);

  const handleAccountClick = async (idCuenta) => {
    try {
      const response = await searchCustomer("Cuenta", idCuenta);
      console.log("Detalles de la cuenta:", response);
      setSearchResults(response.listaResultados || []);
      toast.success(`Cuenta ${idCuenta} seleccionada`, {
        description: "Puede cerrar la ventana para gestionar esta cuenta"
      });
    } catch (error) {
      console.error("Error al buscar detalles de la cuenta:", error);
      toast.error("Error al buscar detalles de la cuenta");
    }
  };

  return (
    <>
      {/* Negociaciones del mes */}
      <br />
      <h5>Negociaciones del mes</h5>
      <Card className="mt-3 text-white scroll">
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Herramienta</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Fecha Término</th>
                  <th>Negociado</th>
                  <th>Pagado</th>
                  <th>Pagos</th>
                </tr>
              </thead>
              <tbody>
                {negotiations.length > 0 ? (
                  negotiations.map((negotiation, index) => (
                    <tr key={index}>
                      <td
                        onClick={() => handleAccountClick(negotiation.idCuenta)}
                        style={{ cursor: "pointer" }}
                        className="text-success"
                      >
                        {negotiation.idCuenta}
                      </td>
                      <td>{negotiation.herramienta}</td>
                      <td>{negotiation.idEstado}</td>
                      <td>{negotiation.fechaCreacion}</td>
                      <td>{negotiation.fechaTermino}</td>
                      <td>{negotiation.montoNegociado}</td>
                      <td>{negotiation.montoPagado}</td>
                      <td>{negotiation.pagos}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Sin datos
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default NegotiationsMonth;
