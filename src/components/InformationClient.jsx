import { Card, Table } from "react-bootstrap";
import { fetchInformation } from "../services/gespawebServices"; // Importa el servicio
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto DEL PADRE 
import { toast, Toaster } from "sonner";
import "../scss/styles.scss"; 

const InformationClient = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const { searchResults } = useContext(AppContext);
  const [toastShown, setToastShown] = useState(false); 

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const information = await Promise.all(
          searchResults.map(async (result, index) => {
            const information  = await fetchInformation(result.idCuenta); // Usar result.idCuenta
            if (information.length === 0 && !toastShown) {
              toast.error(`No hay carga de información para la cuenta ${result.idCuenta}`, {
                position: "top-right" // Mostrar toast en el lado derecho
              });
              setToastShown(true); // Marcar que el toast ya se mostró
            }
            return information;
          })
        );
        const flatInformation = information.flat();
        setData(flatInformation); // Actualizar el estado con los datos de la API
      } catch (error) {
        console.error("Error al cargar la información:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchResults, toastShown]); 
  const renderRow = (item) => (
    <React.Fragment>
      <tr>
        <th>Empresa:</th>
        <td className="text-success">{item['[employersname];[employersaddress]'] || '--'}</td>
        <th>WO \ CBO / ING:</th>
        <td className="text-success">{item['[WO?] \\ [CBO] \\[BloqueoHerramienta] \\ [montlyincome]'] || '--'}</td>
        <th>Fecha de Corte:</th>
        <td className="text-success">{item['[Fechacorte]'] || '--'}</td>
        <th>Fecha de Asignación:</th>
        <td className="text-success">{item['[batchdate]'] || '--'}</td>
      </tr>
      <tr>
        <th>Fecha de Cancelación:</th>
        <td className="text-success">{item['[CancellationDate]'] || '--'}</td>
        <th>Llave 2:</th>
        <td className="text-success">{item['[CollectibilityCode] [SegmentoAMX] [DescuentoAMX]'] || '--'}</td>
        <th>Aniversario:</th>
        <td className="text-success">{item['[anniversarydate] No Ofertar [BloqueoCorporate]'] || '--'}</td>
        <th>Tipo de Crédito:</th>
        <td className="text-success">{item['[Product] [loan_productcode]'] || '--'}</td>
      </tr>
      <tr>
        <th>Manual:</th>
        <td className="text-success">{item['[Valajuste] [AC MANUAL] & [Waiver]'] || '--'}</td>
        <th>Saldo Inicial:</th>
        <td className="text-success">{item['[Balance G*]'] || '--'}</td>
        <th>INV / Atraso:</th>
        <td className="text-success">{item['[INV] \\ [Diasatraso] Días'] || '--'}</td>
        <th>Ejecutivo:</th>
        <td className="text-success">{item['[EJECUTIVO] '] || '--'}</td>
      </tr>
      <tr>
        <th>Interés:</th>
        <td className="text-success">{item['$'] || '--'}</td>
        <th>Fecha de Ultimo Pago:</th>
        <td className="text-success">{item['[Last Date Payment]'] || '--'}</td>
        <th>Monto de Ultimo Pago:</th>
        <td className="text-success">{item['[Amount]'] || '--'}</td>
        <th>Testeo/Contador Co:</th>
        <td className="text-success">{item['[StayDaysOA]\\[SettlementAccountDays]\\[Conjurnet]\\[TESTAPR]'] || '--'}</td>
      </tr>
    </React.Fragment>
  );

  return (
    <Card className="overflow-auto bg-dark">
      <Card.Body>
        <h5 className="card-title text-white">Información</h5>
        <Table hover className="table table-borderless table-custom2" variant="dark">
          <tbody>
            {data.length === 0 ? (
              renderRow({})
            ) : (
              data.map((item, index) => (
                <React.Fragment key={index}>
                  {renderRow(item)}
                </React.Fragment>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default InformationClient;
