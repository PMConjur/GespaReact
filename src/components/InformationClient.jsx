import { Card, Table } from "react-bootstrap";
const InformationClient = () => {
  return (
    <Card className="overflow-auto">
      <Card.Body>
        <h5 className="card-title text-white">
          Información: Estamos trabajando en ello...
        </h5>
        <Table hover className="table table-borderless" variant="dark">
          <tbody>
            {[
              [
                "Empresa:",
                "Gotica;Gotica",
                "CBO / ING:",
                "780",
                "Fecha de Corte:",
                "16/02/2025",
                "Fecha de Asignación",
                "24/10/2017"
              ],
              [
                "Fecha de Cancelación:",
                "",
                "Llave 2:",
                "Low Return Primes 45",
                "Aniversario:",
                "01/09/1986",
                "Tipo de Crédito:",
                "Lending OP"
              ],
              [
                "Manual:",
                "ACSI &",
                "Saldo Inicial:",
                "",
                "INV / Atraso:",
                "[Diasatraso] Días",
                "Ejecutivo:",
                "E-ANT"
              ],
              [
                "Interés:",
                "$",
                "Fecha de Ultimo Pago:",
                "",
                "Monto de Ultimo Pago:",
                "",
                "Testeo/Contador:",
                "2642"
              ]
            ].map((row, index) => (
              <tr key={index}>
                {row.map((cell, i) => (
                  <th key={i} className={i % 2 !== 0 ? "text-success" : ""}>
                    {cell}
                  </th>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default InformationClient;
