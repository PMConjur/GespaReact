import { useState, useEffect } from "react";
import { Dropdown, Form, Table, Spinner } from "react-bootstrap";
import { fetchProcessesWLP } from '../services/gespawebServices';
import { toast } from 'sonner';

const TDropdownProcessesWLP = ({ idCuenta }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [proceso, setProceso] = useState("Arrangement");
    const procesos = [
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
    const [processData, setProcessData] = useState([]);

    useEffect(() => {
        if (proceso && idCuenta) {
            fetchData(idCuenta);
        }
    }, [proceso, idCuenta]);

    const fetchData = async (idCuenta) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedData = await fetchProcessesWLP(proceso, idCuenta);
            setProcessData(fetchedData);
        } catch (err) {
            setError(err);
            toast.error("Error al obtener datos.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleProcesoChange = (eventKey) => {
        if (proceso !== eventKey) {
            setProceso(eventKey);
            setProcessData([]); // Limpiar datos al cambiar el proceso
        }
    };

    const renderTable = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            );
        }

        if (error) {
            return <p className="text-danger">Error: {error.message}</p>;
        }

        if (!processData || processData.length === 0) {
            return <p>No hay datos para mostrar.</p>;
        }

        switch (proceso) {
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
                            {processData.map((item, index) => (
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
            // ... otros casos para cada proceso
            default:
                return <p>No hay datos para mostrar.</p>;
        }
    };

    return (
        <div className="text-center">
            <Form.Group className="mb-3">
                <Form.Label>Selecciona un proceso:</Form.Label>
                <Dropdown onSelect={handleProcesoChange}>
                    <Dropdown.Toggle variant="primary" id="dropdown-proceso">
                        {proceso}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {procesos.map((proc) => (
                            <Dropdown.Item key={proc} eventKey={proc}>
                                {proc}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>
            {renderTable()}
        </div>
    );
};

export default TDropdownProcessesWLP;