import { useState, useEffect, useContext } from "react";
import { Dropdown, Form, Table } from "react-bootstrap";
import { fetchProcessesWLP } from '../services/gespawebServices';
import { AppContext } from '../pages/Managment';
import { toast } from 'sonner';

const TDropdownProcessesWLP = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [producto, setProducto] = useState("Arrangement");
    const productos = [
        "Arrangement",
        "ArrangementDetails",
        "Dispute",
        "EmailAddress",
        "EmailEvent",
        "EmailSent",
        "EmailUnsubscribe",
        "SmsOptOut",
        "SmsSent",
        "SpecialCircumstances",
    ];
    const [productData, setProductData] = useState(data || []);

    const { searchResults } = useContext(AppContext);

    useEffect(() => {
        if (producto && searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
            const idCuenta = searchResults[0].idCuenta.trim();
            fetchData(idCuenta);
        }
    }, [producto, searchResults]);

    useEffect(() => {
        setProductData(data);
    }, [data]);

    const fetchData = async (idCuenta) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProcessesWLP(producto, [{idCuenta:idCuenta}]);
            setProductData(data);
        } catch (err) {
            setError(err);
            toast.error("Error al obtener datos.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleProductoChange = (eventKey) => {
        if (producto !== eventKey) {
            setProducto(eventKey);
            setProductData([]); // Limpiar datos al cambiar el producto
            if (!data || data.length === 0) {
                toast.error("Error 408: No se encontraron datos para esta selección.", { position: "top-right" });
            }
        }
    };

    const renderTable = () => {
        if (!productData || productData.length === 0) return null;

        switch (producto) {
            case "Arrangement":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>ArrangmentId</th>
                                <th>UpdateTime</th>
                                <th>ArrangmentType</th>
                                <th>TotalAmount</th>
                                <th>Status</th>
                                <th>FundingAcctLast4</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.ArrangmentId}</td>
                                    <td>{item.UpdateTime}</td>
                                    <td>{item.ArrangmentType}</td>
                                    <td>{item.TotalAmount}</td>
                                    <td>{item.Status}</td>
                                    <td>{item.FundingAcctLast4}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "ArrangementDetails":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>ArrangmentId</th>
                                <th>PaymentId</th>
                                <th>UpdateTime</th>
                                <th>PaymentDate</th>
                                <th>PaymentAmount</th>
                                <th>Status</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.ArrangmentId}</td>
                                    <td>{item.PaymentId}</td>
                                    <td>{item.UpdateTime}</td>
                                    <td>{item.PaymentDate}</td>
                                    <td>{item.PaymentAmount}</td>
                                    <td>{item.Status}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "Dispute":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>SubmitTime</th>
                                <th>DisputeType</th>
                                <th>DisputeAmount</th>
                                <th>Details</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.SubmitTime}</td>
                                    <td>{item.DisputeType}</td>
                                    <td>{item.DisputeAmount}</td>
                                    <td>{item.Details}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "EmailAddress":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>UpdateTime</th>
                                <th>NewEmail</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.UpdateTime}</td>
                                    <td>{item.NewEmail}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "EmailEvent":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>EventTime</th>
                                <th>EventType</th>
                                <th>TransmisionId</th>
                                <th>EmailToAddress</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.EventTime}</td>
                                    <td>{item.EventType}</td>
                                    <td>{item.TransmisionId}</td>
                                    <td>{item.EmailToAddress}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "EmailSent":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>MailPushedDate</th>
                                <th>EmailTemplateId</th>
                                <th>TransmissionId</th>
                                <th>EmailToAddress</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.MailPushedDate}</td>
                                    <td>{item.EmailTemplateId}</td>
                                    <td>{item.TransmissionId}</td>
                                    <td>{item.EmailToAddress}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "EmailUnsubscribe":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>UnsubscribeTime</th>
                                <th>EmailAddress</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.UnsubscribeTime}</td>
                                    <td>{item.EmailAddress}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "SmsOptOut":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>OptOutReceived</th>
                                <th>PhoneNumber</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.OptOutReceived}</td>
                                    <td>{item.PhoneNumber}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "SmsSent":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>SentTime</th>
                                <th>TemplateId</th>
                                <th>PhoneNumber</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.SentTime}</td>
                                    <td>{item.TemplateId}</td>
                                    <td>{item.PhoneNumber}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case "SpecialCircumstances":
                return (
                    <Table striped bordered hover responsive variant="dark">
                        <thead>
                            <tr>
                                <th>RecordType</th>
                                <th>CM15</th>
                                <th>AgencyID</th>
                                <th>AgencyAccountNumber</th>
                                <th>SubmitTime</th>
                                <th>FormType</th>
                                <th>Details</th>
                                <th>FechaInsercion</th>
                                <th>IdArchivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.RecordType}</td>
                                    <td>{item.CM15}</td>
                                    <td>{item.AgencyID}</td>
                                    <td>{item.AgencyAccountNumber}</td>
                                    <td>{item.SubmitTime}</td>
                                    <td>{item.FormType}</td>
                                    <td>{item.Details}</td>
                                    <td>{item.FechaInsercion}</td>
                                    <td>{item.IdArchivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            // ... otros casos para cada producto
            default:
                return <p>No hay datos para mostrar.</p>;
        }
    };

    return (
        <div className="text-center">
            <Form.Group className="mb-3">
                <Form.Label></Form.Label>
                <Dropdown onSelect={handleProductoChange}>
                    <Dropdown.Toggle variant="primary" id="dropdown-producto">
                        {producto}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {productos.map((prod) => (
                            <Dropdown.Item key={prod} eventKey={prod}>
                                {prod}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            {loading && <p>Cargando...</p>}
            {error && <p>Error: {error.message}</p>}

            {renderTable()}
        </div>
    );
};

export default TDropdownProcessesWLP;