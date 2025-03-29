import React, { useState, useEffect, useContext } from "react";
import { Dropdown, Form, Table, Spinner, Alert } from "react-bootstrap";
import { fetchProcessesWLP } from '../services/gespawebServices';
import { AppContext } from '../pages/Managment';
import { toast } from 'sonner';

const TDropdownProcessesWLP = ({ data = [] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [producto, setProducto] = useState("Arrangement");
    const [productData, setProductData] = useState([]);
    

    const hiddenFields = [
        "idProceso", 
        "idCuenta", 
        "FechaCreacion", 
        "UsuarioCreacion",
        "RecordType", // Campo oculto
        "CM15"        // Campo oculto
    ];
    
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

    const { searchResults = [] } = useContext(AppContext) || {};


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!Array.isArray(searchResults)) {
                    console.error('searchResults no es un array:', searchResults);
                    return;
                }

                const account = searchResults.find(item => item?.idCuenta);
                if (!account) {
                    console.warn('No se encontró idCuenta en searchResults');
                    toast.info('No hay datos de cuenta disponibles', { position: "top-right" });
                    setProductData([]);
                    return;
                }

                const idCuenta = account.idCuenta?.toString()?.trim();
                if (!idCuenta) {
                    console.warn('idCuenta vacío o inválido');
                    toast.warning('ID de cuenta inválido', { position: "top-right" });
                    return;
                }

                setLoading(true);
                setError(null);
                
                const result = await fetchProcessesWLP(producto, idCuenta);
                
                if (!result || result.length === 0) {
                    toast.info(`No se encontraron datos para ${producto}`, { position: "top-right" });
                }
                setProductData(result || []);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err);
                toast.error(`Error al obtener ${producto}: ${err.message}`, { position: "top-right" });
                setProductData([]);
            } finally {
                setLoading(false);
            }
        };

        if (producto) {
            fetchData();
        }
    }, [producto, searchResults]);

    const handleProductoChange = (eventKey) => {
        if (producto !== eventKey) {
            setProducto(eventKey);
        }
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-2">Cargando datos...</span>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="danger" className="mt-3">
                    Error al cargar los datos: {error.message || 'Error desconocido'}
                </Alert>
            );
        }

        if (!productData || productData.length === 0) {
            return (
                <div className="mt-3">
                    <p className="text-info">No se encontraron datos para {producto}</p>
                    {searchResults.length === 0 && (
                        <div className="mt-2">
                            <small>No hay resultados de búsqueda disponibles</small>
                        </div>
                    )}
                </div>
            );
        }

        const columns = productData.length > 0 
            ? Object.keys(productData[0]).filter(key => !hiddenFields.includes(key)) 
            : [];

        return (
            <div className="table-responsive">
                <Table striped bordered hover variant="dark" style={{ padding: ".7rem" }}>
                    <thead>
                        <tr>
                            {columns.map(key => (
                                <th key={key} style={{ textAlign: "center" }}>
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {productData.map((item, index) => (
                            <tr key={index}>
                                {columns.map(key => (
                                    <td key={`${index}-${key}`} style={{ textAlign: "justify" }}>
                                        {key === "Details" && item[key] ? (
                                            <div style={{
                                                width: "300px",
                                                whiteSpace: "pre-wrap",
                                                wordWrap: "break-word"
                                            }}>
                                                {item[key].toString()}
                                            </div>
                                        ) : (
                                            item[key] !== null && item[key] !== undefined 
                                                ? item[key].toString() 
                                                : 'N/A'
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    };

    return (
        <div className="p-3">
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Seleccione un proceso:</Form.Label>
                <Dropdown onSelect={handleProductoChange}>
                    <Dropdown.Toggle 
                        variant="primary" 
                        id="dropdown-processes"
                        disabled={searchResults.length === 0}
                    >
                        {producto}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {productos.map((prod) => (
                            <Dropdown.Item 
                                key={prod} 
                                eventKey={prod}
                                active={producto === prod}
                            >
                                {prod}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                {searchResults.length === 0 && (
                    <Form.Text className="text-warning">
                        Realice una búsqueda primero para habilitar la selección
                    </Form.Text>
                )}
            </Form.Group>
            <div className="mt-3">
                {renderTableContent()}
            </div>
        </div>
    );
};

export default TDropdownProcessesWLP;