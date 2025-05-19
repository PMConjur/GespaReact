import { useState, useContext, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { fetchScripts } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";

const TDropdownScripts = ({ data }) => {
    const [selectedScript, setSelectedScript] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("Selecciona un Script");
    const [scriptsData, setScriptsData] = useState([]);
    const { searchResults, idEjecutivo, } = useContext(AppContext);
    const [valoresExtraidos, setValoresExtraidos] = useState({});
    const [cuenta, setCuenta] = useState("");
    const [idProducto, setIdProducto] = useState(1);
    const [idCartera, setIdCartera] = useState(1);
    const Ejecutivo = idEjecutivo || 0;

    const handleSelect = (eventKey) => {
        const script = scriptsData.find(script => script.idScript === parseInt(eventKey));
        const clonedScript = JSON.parse(JSON.stringify(script));
        setSelectedScript(clonedScript);
        setSelectedLabel(script.Nombre.replace(/&/g, ''));

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

    useEffect(() => {
        if (searchResults && searchResults.length > 0) {
            setCuenta(searchResults[0]?.idCuenta || "");
            setIdProducto(searchResults[0]?.idProducto || 1);
            setIdCartera(searchResults[0]?.idCartera || 1);
        } else {
            console.warn("searchResults no tiene datos o está vacío.");
            setCuenta("");
            setIdProducto(1);
            setIdCartera(1);
        }
    }, [searchResults]); // Este efecto se ejecuta cada vez que searchResults cambia

    useEffect(() => {
        const fetchData = async () => {
            if (!cuenta) {
                console.warn("El valor de 'cuenta' está vacío. Esperando datos de búsqueda para cargar scripts.");
                return; // No hacer la llamada si cuenta está vacío inicialmente
            }
            try {
                console.log("Valores para fetchScripts:", { Ejecutivo, idProducto, idCartera, cuenta });
                const scripts = await fetchScripts(Ejecutivo, idProducto, idCartera, cuenta);
                console.log("Scripts obtenidos:", scripts);
                setScriptsData(scripts);
            } catch (error) {
                console.error("Error fetching scripts:", error);
            }
        };

        fetchData();
    }, [Ejecutivo, idProducto, idCartera, cuenta]); // Depende de los valores obtenidos de searchResults

    return (
        <div className="text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div>
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {selectedLabel}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: '400px', overflowY: 'auto', margin: '0 auto' }}>
                        {scriptsData.map(script => (
                            <Dropdown.Item key={script.idScript} eventKey={script.idScript} className="text-center">
                                {script.Nombre.replace(/&/g, '')}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            {selectedScript && (
                <div className="mt-3 text-center">
                    <p>{selectedScript.Descripción.replace(/&/g, '')}</p>
                    <pre
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            textAlign: 'justify',
                            textAlignLast: 'center',
                            lineHeight: '1.6',
                            letterSpacing: '0.5px',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '16px',
                            margin: '10px auto',
                            padding: '5px'
                        }}
                    >
                        {selectedScript.Script.replace(/\*/g, '').replace(/&/g, '')}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TDropdownScripts;