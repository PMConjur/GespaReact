import { useState } from "react";
import { Dropdown } from "react-bootstrap";

const TDropdownScripts = ({ data }) => {
    const [selectedScript, setSelectedScript] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("Selecciona un Script");

    const handleSelect = (eventKey) => {
        const script = data.find(script => script.idScript === parseInt(eventKey));
        setSelectedScript(script);
        setSelectedLabel(script.Nombre);
    };

    return (
        <div className="text-center">
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedLabel}
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
                    
                    <p>{selectedScript.Descripción}</p>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'justify', fontFamily: 'Arial' }}>
                        {selectedScript.Script.replace(/[*&]/g, '')}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TDropdownScripts;
