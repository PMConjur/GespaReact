import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

const TDropdownScripts = ({ data }) => {
    const [selectedScript, setSelectedScript] = useState(null);

    const handleSelect = (eventKey) => {
        const script = data.find(script => script.idScript === parseInt(eventKey));
        setSelectedScript(script);
    };

    return (
        <div className="text-center">
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Selecciona un Script
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '400px', overflowY: 'auto', margin: '0 auto' }}>
                    {data.map(script => (
                        <Dropdown.Item key={script.idScript} eventKey={script.idScript} className="text-center">
                            {script.Nombre}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            {selectedScript && (
                <div className="mt-3 text-center">
                    <h5>{selectedScript.Nombre}</h5>
                    <p>{selectedScript.Descripción}</p>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'justify' }}>
                        {selectedScript.Script.replace(/[*&]/g, '')}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TDropdownScripts;
