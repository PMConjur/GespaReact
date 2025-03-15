import React, { useState } from "react";
import { Dropdown, Table } from "react-bootstrap";

const TDropdownProcessesWLP = ({ data = [], Proceso }) => {
    const [selectedProcessesWLP, setSelectedProcessesWLP] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("Selecciona un Proceso");

    const handleSelect = (eventKey) => {
        const selectedProcess = data.find(process => process.RecordType === eventKey);
        setSelectedProcessesWLP(selectedProcess);
        setSelectedLabel(selectedProcess ? selectedProcess.RecordType : "Selecciona un Proceso");
    };

    const recordTypes = [
        "Arrangement",
        "ArrangementDetails",
        "Dispute",
        "EmailAddress",
        "EmailEvent",
        "EmailSent",
        "EmailUnsubscribe",
        "SmsOptOut",
        "SmsSent",
        "SpecialCircumstances"
    ];

    const renderTableRows = () => {
        if (!selectedProcessesWLP) {
            return null;
        }

        if (selectedProcessesWLP.RecordType === "Arrangement") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, ArrangmentId, UpdateTime, ArrangmentType, TotalAmount, Status, FundingAcctLast4, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>ArrangmentId</td><td>{ArrangmentId}</td></tr>
                    <tr><td>UpdateTime</td><td>{UpdateTime}</td></tr>
                    <tr><td>ArrangmentType</td><td>{ArrangmentType}</td></tr>
                    <tr><td>TotalAmount</td><td>{TotalAmount}</td></tr>
                    <tr><td>Status</td><td>{Status}</td></tr>
                    <tr><td>FundingAcctLast4</td><td>{FundingAcctLast4}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "ArrangementDetails") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, ArrangmentId, PaymentId, UpdateTime, PaymentDate, PaymentAmount, Status, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>ArrangmentId</td><td>{ArrangmentId}</td></tr>
                    <tr><td>PaymentId</td><td>{PaymentId}</td></tr>
                    <tr><td>UpdateTime</td><td>{UpdateTime}</td></tr>
                    <tr><td>PaymentDate</td><td>{PaymentDate}</td></tr>
                    <tr><td>PaymentAmount</td><td>{PaymentAmount}</td></tr>
                    <tr><td>Status</td><td>{Status}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "Dispute") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, SubmitTime, DisputeType, DisputeAmount, Details, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>SubmitTime</td><td>{SubmitTime}</td></tr>
                    <tr><td>DisputeType</td><td>{DisputeType}</td></tr>
                    <tr><td>DisputeAmount</td><td>{DisputeAmount}</td></tr>
                    <tr><td>Details</td><td>{Details}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "EmailAddress") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, UpdateTime, NewEmail, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>UpdateTime</td><td>{UpdateTime}</td></tr>
                    <tr><td>NewEmail</td><td>{NewEmail}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "EmailEvent") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, EventTime, EventType, TransmisionId, EmailToAddress, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>EventTime</td><td>{EventTime}</td></tr>
                    <tr><td>EventType</td><td>{EventType}</td></tr>
                    <tr><td>TransmisionId</td><td>{TransmisionId}</td></tr>
                    <tr><td>EmailToAddress</td><td>{EmailToAddress}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "EmailSent") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, MailPushedDate, EmailTemplateId, TransmissionId, EmailToAddress, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>MailPushedDate</td><td>{MailPushedDate}</td></tr>
                    <tr><td>EmailTemplateId</td><td>{EmailTemplateId}</td></tr>
                    <tr><td>TransmissionId</td><td>{TransmissionId}</td></tr>
                    <tr><td>EmailToAddress</td><td>{EmailToAddress}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "EmailUnsubscribe") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, UnsubscribeTime, EmailAddress, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>UnsubscribeTime</td><td>{UnsubscribeTime}</td></tr>
                    <tr><td>EmailAddress</td><td>{EmailAddress}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "SmsOptOut") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, OptOutReceived, PhoneNumber, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>OptOutReceived</td><td>{OptOutReceived}</td></tr>
                    <tr><td>PhoneNumber</td><td>{PhoneNumber}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "SmsSent") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, SentTime, TemplateId, PhoneNumber, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>SentTime</td><td>{SentTime}</td></tr>
                    <tr><td>TemplateId</td><td>{TemplateId}</td></tr>
                    <tr><td>PhoneNumber</td><td>{PhoneNumber}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        if (selectedProcessesWLP.RecordType === "SpecialCircumstances") {
            const { RecordType, CM15, AgencyID, AgencyAccountNumber, SubmitTime, FormType, Details, FechaInsercion, IdArchivo } = selectedProcessesWLP;
            return (
                <>
                    <tr><td>RecordType</td><td>{RecordType}</td></tr>
                    <tr><td>CM15</td><td>{CM15}</td></tr>
                    <tr><td>AgencyID</td><td>{AgencyID}</td></tr>
                    <tr><td>AgencyAccountNumber</td><td>{AgencyAccountNumber}</td></tr>
                    <tr><td>SubmitTime</td><td>{SubmitTime}</td></tr>
                    <tr><td>FormType</td><td>{FormType}</td></tr>
                    <tr><td>Details</td><td>{Details}</td></tr>
                    <tr><td>FechaInsercion</td><td>{FechaInsercion}</td></tr>
                    <tr><td>IdArchivo</td><td>{IdArchivo}</td></tr>
                </>
            );
        }

        // Agregar más condiciones para otros tipos de registros si es necesario

        return null;
    };

    return (
        <div className="text-center">
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedLabel}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '400px', overflowY: 'auto', margin: '0 auto' }}>
                    {recordTypes.map(recordType => (
                        <Dropdown.Item key={recordType} eventKey={recordType} className="text-center">
                            {recordType}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            {selectedProcessesWLP && (
                <Table striped bordered hover style={{ marginTop: '20px' }}>
                    <tbody>
                        {renderTableRows()}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default TDropdownProcessesWLP;
