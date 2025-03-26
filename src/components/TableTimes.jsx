import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import { userTimes } from "../services/gespawebServices";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";

const TableTimes = ({ updatedTimes }) => {
    const { idEjecutivo } = useContext(AppContext);

    const [executiveId, setExecutiveId] = useState(idEjecutivo || null);
    const [timesData, setTimesData] = useState({
        total: {
            cuentas: "--:--:--",
            negociacion: "--:--:--",
            titulares: "--:--:--",
            conocidos: "--:--:--",
            desconocidos: "--:--:--",
            sinContacto: "--:--:--",
            Permiso: "--:--:--",
            Curso: "--:--:--",
            Calidad: "--:--:--",
            Comida: "--:--:--",
            Baño: "--:--:--",
        },
        promedio: {
            cuentas: "--:--:--",
            negociacion: "--:--:--",
            titulares: "--:--:--",
            conocidos: "--:--:--",
            desconocidos: "--:--:--",
            sinContacto: "--:--:--",
            Permiso: "--:--:--",
            Curso: "--:--:--",
            Calidad: "--:--:--",
            Comida: "--:--:--",
            Baño: "--:--:--",
        },
    });

    useEffect(() => {
        if (!executiveId) {
            const responseDataString = sessionStorage.getItem("responseData");
            if (responseDataString) {
                try {
                    const responseData = JSON.parse(responseDataString);
                    setExecutiveId(responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || null);
                } catch (error) {
                    console.error("Error al parsear responseData:", error);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (!executiveId) return;

        const fetchTimes = async () => {
            try {
                const data = await userTimes(executiveId);
                
                if (!data || !data.resultadosTiempos) {
                    toast.warning("No hay datos de tiempos disponibles");
                    return;
                }

                const tiempos = data.resultadosTiempos;
                const processTime = (timeValue) => {
                    if (timeValue == null || isNaN(timeValue) || timeValue === "") {
                        return "--:--:--";
                    }
                    return formatTime(Number(timeValue));
                };

                setTimesData({
                    total: {
                        cuentas: processTime(tiempos.tiempoCuentas),
                        negociacion: processTime(tiempos.tiempoNegociaciones),
                        titulares: processTime(tiempos.tiempoTitulares),
                        conocidos: processTime(tiempos.tiempoConocidos),
                        desconocidos: processTime(tiempos.tiempoDesconocidos),
                        sinContacto: processTime(tiempos.tiempoSinContacto),
                        Permiso: processTime(tiempos.tiempoPermiso),
                        Curso: processTime(tiempos.tiempoCurso),
                        Calidad: processTime(tiempos.tiempoCalidad),
                        Comida: processTime(tiempos.tiempoComida),
                        Baño: processTime(tiempos.tiempoBaño),
                    },
                    promedio: {
                        ...Object.fromEntries(
                            Object.keys(timesData.promedio).map(key => [key, processTime(tiempos[key])])
                        )
                    }
                });
            } catch (error) {
                toast.error(`Error al cargar tiempos: ${error.message}`);
            }
        };

        fetchTimes();
    }, [executiveId]);

    // Efecto corregido para updatedTimes
    useEffect(() => {
        if (updatedTimes) {
            setTimesData(prev => ({
                ...prev,
                total: {
                    ...prev.total,
                    ...Object.fromEntries(
                        Object.entries(updatedTimes).map(([key, value]) => 
                            [key, formatTime(value)]
                        )
                    )
                }
            }));
        }
    }, [updatedTimes]);

    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined || isNaN(seconds)) {
            return "--:--:--";
        }
        if (seconds === 0) {
            return "00:00:00";
        }
        
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    const renderRows = (type) => {
        return Object.keys(timesData[type]).map((key) => (
            <td key={key} style={{ minWidth: "100px" }}>{timesData[type][key]}</td>
        ));
    };

    if (!executiveId) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                ⚠️ No se encontró un ID de ejecutivo válido. Verifica tu sesión.
            </div>
        );
    }

    return (
        <Table responsive variant="dark">
            <thead>
                <tr>
                    <th>Indicador</th>
                    <th style={{ minWidth: "100px" }}>Cuentas</th>
                    <th style={{ minWidth: "100px" }}>Negociación</th>
                    <th style={{ minWidth: "100px" }}>Titulares</th>
                    <th style={{ minWidth: "100px" }}>Conocidos</th>
                    <th style={{ minWidth: "100px" }}>Desconocidos</th>
                    <th style={{ minWidth: "100px" }}>Sin contacto</th>
                    <th style={{ minWidth: "100px" }}>Permiso</th>
                    <th style={{ minWidth: "100px" }}>Curso</th>
                    <th style={{ minWidth: "100px" }}>Calidad</th>
                    <th style={{ minWidth: "100px" }}>Comida</th>
                    <th style={{ minWidth: "100px" }}>Baño</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Total</th>
                    {renderRows("total")}
                </tr>
                <tr>
                    <th scope="row">Promedio</th>
                    {renderRows("promedio")}
                </tr>
            </tbody>
        </Table>
    );
};

TableTimes.propTypes = {
    updatedTimes: PropTypes.object,
};

export default TableTimes;