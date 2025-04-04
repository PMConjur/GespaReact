import { useState, useContext, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { fetchScripts } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";

const TDropdownScripts = ({ data }) => {
    const [selectedScript, setSelectedScript] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("Selecciona un Script");
    const [scriptsData, setScriptsData] = useState([]);
    const { searchResults, idEjecutivo, } = useContext(AppContext);
    const [valoresExtraidos, setValoresExtraidos] = useState({}); // Nuevo estado para los valores extraídos



    const handleSelect = (eventKey) => {
        console.log("data en handleSelect:", scriptsData[0]); // Inspecciona data
        const script = scriptsData.find(script => script.idScript === parseInt(eventKey));
        console.log("script en handleSelect después de find:", script); // Inspecciona data

        const clonedScript = JSON.parse(JSON.stringify(script)); // Clona el script

        console.log("data clonedScript en handleSelect:", clonedScript); // Inspecciona data

        // setSelectedScript(script);
        setSelectedScript(clonedScript);

        setSelectedLabel(script.Nombre);

        console.log("Script en handleSelect:", script.Script); // Inspeccionar el script seleccionado

        // Extraer los valores del script seleccionado
        if (script && script.Script) {
            const lineas = script.Script.split("\n");
            const valores = {};
            lineas.forEach((linea) => {
                const partes = linea.split(": *$");
                if (partes.length === 2) {
                    valores[partes[0].trim()] = parseFloat(partes[1]);
                }
            });
            setValoresExtraidos(valores);
        } else {
            setValoresExtraidos({}); 
        }
    };

    let cuenta = "";
    let idProducto = 1;
    let idCartera = 1;

    // Verificar y obtener valores de searchResults
    if (searchResults && searchResults.length > 0 && searchResults[0]) {
        console.log("searchResults[0]:", searchResults[0]); // Inspeccionar searchResults[0]
        cuenta = searchResults[0]?.idCuenta || "";
        idProducto = searchResults[0]?.idProducto || 1;
        idCartera = searchResults[0]?.idCartera || 1;
    } else {
        console.error("searchResults no tiene datos o está vacío.");
    }

    
    if (!cuenta) {
        console.warn("El valor de 'cuenta' está vacío. Verifica los datos de searchResults.");
    }

    const Ejecutivo = idEjecutivo || 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Valores para fetchScripts:", { Ejecutivo, idProducto, idCartera, cuenta });
                const scripts = await fetchScripts(Ejecutivo, idProducto, idCartera, cuenta);
                console.log("Script seleccionado:", scripts[0].Script); 
                setScriptsData(scripts);
                console.log("data en useEffect:", scripts[0].Script); // Verifica el valor de data
            } catch (error) {
                console.error("Error fetching scripts:", error);
            }
        };

        fetchData();
    }, [idProducto, idCartera, cuenta, Ejecutivo]);

    return (
        <div className="text-center">
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedLabel}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '400px', overflowY: 'auto', margin: '0 auto' }}>
                    {scriptsData.map(script => (
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
                    <pre
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            textAlign: 'justify',
                            lineHeight: '1.6',
                            letterSpacing: '0.5px',
                            fontFamily: 'Courier, monospace',
                            fontSize: '16px',
                            margin: '10px 0',
                            padding: '5px'
                        }}
                    >
                        {selectedScript.Script.replace(/\*/g, '')}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TDropdownScripts;