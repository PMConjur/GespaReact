import  { useContext} from "react";
import { Table, Row, Container } from "react-bootstrap";
import { reemplazarValores } from "./ValoresCatalogos.js"; // Importa el método
import { AppContext } from "../pages/Managment.jsx";
import { toast} from "sonner";
import { searchCustomer } from "../services/gespawebServices.js"; // Importa la función de búsqueda

const Tabledailymanagement = ( {cuentasData }) => {
  const { setSearchResults } = useContext(AppContext);

  const renderCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? "";
  };

  const handleAccountClick = async (idCuenta) => {
    try {
      const response = await searchCustomer("Cuenta", idCuenta);
      console.log("Detalles de la cuenta:", response);
      setSearchResults(response.listaResultados || []);
      toast.success(`Cuenta ${idCuenta} seleccionada`, {
        description: "Puede cerrar la ventana para gestionar esta cuenta",
      });
    } catch (error) {
      console.error("Error al buscar detalles de la cuenta:", error);
      toast.error("Error al buscar detalles de la cuenta");
    }
  };
  return (
    <Container>
      <hr />
      <Row>
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cuenta</th>
              <th>Producto</th>
              <th>Situacion</th>
              <th>Nombre</th>
              <th>RFC</th>
              <th>NumeroCliente</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {cuentasData.map((item, index) => (
              <tr key={index}>
                <td>{renderCell(item.Fecha_Insert)}</td>
                <td>{renderCell(item.Segundo_Insert)}</td>
                <td 
                 onClick={() => handleAccountClick(item.idCuenta)}
                 style={{ cursor: "pointer" }}
                 className="text-success"
                >{renderCell(item.idCuenta)}</td>
                <td>{renderCell(reemplazarValores(item.idProducto))}</td>
                <td>{renderCell(reemplazarValores(item.idSituación))}</td>
                <td>{renderCell(item.NombreDeudor)}</td>
                <td>{renderCell(item.RFC)}</td>
                <td>{renderCell(item.NúmeroCliente)}</td>
                <td>{renderCell(item.Saldo)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default Tabledailymanagement;
