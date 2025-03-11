import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importar PropTypes
import { Table } from "react-bootstrap";
import { userTimes } from "../services/gespawebServices";
import { toast } from "sonner"; // Notificaciones

const TableTimes = ({ updatedTimes }) => {
    // Obtener responseData de location.state o localStorage
    const responseData = location.state || JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

    // Si `idEjecutivo` no se pasa como prop, intentamos obtenerlo de sessionStorage
    const [executiveId, setExecutiveId] = useState(idEjecutivo || null);
    const [timesData, setTimesData] = useState({
        total: {
            cuentas: "00:00:00",
            negociacion: "00:00:00",
            titulares: "00:00:00",
            conocidos: "00:00:00",
            desconocidos: "00:00:00",
            sinContacto: "00:00:00",
            Permiso: "00:00:00",
            Curso: "00:00:00",
            Calidad: "00:00:00",
            Comida: "00:00:00",
            Baño: "00:00:00",
            Fa: "00:00:00",
        },
        promedio: {
            cuentas: "00:00:00",
            negociacion: "00:00:00",
            titulares: "00:00:00",
            conocidos: "00:00:00",
            desconocidos: "00:00:00",
            sinContacto: "00:00:00",
            Permiso: "00:00:00",
            Curso: "00:00:00",
            Calidad: "00:00:00",
            Comida: "00:00:00",
            Baño: "00:00:00",
        },
    });

    // Verificar si idEjecutivo no se pasó como prop, intentar obtenerlo de sessionStorage
    useEffect(() => {
        if (!executiveId) {
            const responseDataString = sessionStorage.getItem("responseData");

            if (responseDataString) {
                try {
                    const responseData = JSON.parse(responseDataString);
                    console.log("📌 Datos obtenidos de sessionStorage:", responseData);
                    setExecutiveId(responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || null);
                } catch (error) {
                    console.error("❌ Error al parsear responseData:", error);
                }
            } else {
                console.warn("⚠️ No se encontró responseData en sessionStorage.");
            }
        }
    }, [executiveId]);

    const formatTime = (seconds) => {
        if (!seconds) return "00:00:00";
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    useEffect(() => {
        if (!executiveId) {
            console.warn("⚠️ No se encontró un ID de ejecutivo válido.");
            return;
        }

        console.log(`📡 Consultando tiempos para el ejecutivo con ID: ${executiveId}`);

        userTimes(executiveId)
            .then((data) => {
                if (!data || !data.resultadosTiempos) {
                    console.warn("⚠️ La API no devolvió resultados válidos.");
                    toast.warning("No hay datos de tiempos disponibles.");
                    return;
                }

                const tiempos = data.resultadosTiempos;

                setTimesData((prevData) => ({
                    ...prevData,
                    total: {
                        ...prevData.total,
                        cuentas: formatTime(tiempos.tiempoCuentas),
                        negociacion: formatTime(tiempos.tiempoNegociaciones),
                        titulares: formatTime(tiempos.tiempoTitulares),
                        conocidos: formatTime(tiempos.tiempoConocidos),
                        desconocidos: formatTime(tiempos.tiempoDesconocidos),
                        sinContacto: formatTime(tiempos.tiempoSinContacto),
                    },
                    promedio: {
                        ...prevData.promedio,
                        cuentas: formatTime(tiempos.tiempoCuentas),
                        negociacion: formatTime(tiempos.tiempoNegociaciones),
                        titulares: formatTime(tiempos.tiempoTitulares),
                        conocidos: formatTime(tiempos.tiempoConocidos),
                        desconocidos: formatTime(tiempos.tiempoDesconocidos),
                        sinContacto: formatTime(tiempos.tiempoSinContacto),
                    },
                }));
            })
            .catch((error) => {
                console.error("❌ Error al obtener los tiempos:", error);
                toast.error("❌ Error al cargar los tiempos.");
            });
    }, [executiveId]);

    useEffect(() => {
        if (updatedTimes) {
            const formattedTimes = {};
            for (const key in updatedTimes) {
                formattedTimes[key] = formatTime(updatedTimes[key]);
            }

            setTimesData((prevData) => ({
                ...prevData,
                total: {
                    ...prevData.total,
                    ...formattedTimes,
                },
                promedio: {
                    ...prevData.promedio,
                    ...formattedTimes,
                },
            }));
        }
    }, [updatedTimes]);

    if (!executiveId) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                ⚠️ No se encontró un ID de ejecutivo válido. Verifica tu sesión.
            </div>
        );
    }

    const renderRows = (type) => {
        return Object.keys(timesData[type]).map((key) => (
            <td key={key} style={{ minWidth: "100px" }}>{timesData[type][key]}</td>
        ));
    };

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
                    <th style={{ minWidth: "100px" }}>Falla Tecnica</th>
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
    updatedTimes: PropTypes.object, // Validación de prop
};

export default TableTimes;