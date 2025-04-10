import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import { userTimes, userTimesPromedio } from "../services/gespawebServices";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";

const TIME_CATEGORIES = [
    'cuentas', 'negociacion', 'titulares', 
    'conocidos', 'desconocidos', 'sinContacto',
    'Permiso', 'Curso', 'Calidad', 'Comida', 'Baño'
];

const formatTime = (value) => {
    if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value)) {
        return value;
    }
    
    if (value == null || isNaN(Number(value))) {
        return "--:--:--";
    }
    
    const seconds = Math.floor(Number(value));
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    
    return `${hrs}:${mins}:${secs}`;
};

// Normalización para tiempos totales
const normalizeTotalTimes = (data) => {
    const keyMap = {
        tiempoCuentas: "tiempoCuentas",
        tiempoNegociaciones: "tiempoNegociaciones",
        tiempoTitulares: "tiempoTitulares",
        tiempoConocidos: "tiempoConocidos",
        tiempoDesconocidos: "tiempoDesconocidos",
        tiempoSinContacto: "tiempoSinContacto",
        tiempoPermiso: "tiempoPermiso",
        tiempoCurso: "tiempoCurso",
        tiempoCalidad: "tiempoCalidad",
        tiempoComida: "tiempoComida",
        tiempoBaño: "tiempoBaño",
    };

    if (!data || Object.keys(data).length === 0) {
        return Object.fromEntries(Object.values(keyMap).map(key => [key, null]));
    }

    return Object.entries(data).reduce((acc, [key, value]) => {
        const normalizedKey = keyMap[key] || key;
        acc[normalizedKey] = (value && typeof value === 'object' && Object.keys(value).length === 0) ? null : value;
        return acc;
    }, {});
};

// Normalización para tiempos promedios
const normalizeAverageTimes = (data) => {
    const keyMap = {
        promedioCuentas: "cuentas",
        promedioNegociaciones: "negociacion",
        promedioTitulares: "titulares",
        promedioConocidos: "conocidos",
        promedioDesconocidos: "desconocidos",
        promedioSinContacto: "sinContacto",
        promedioPermiso: "Permiso",
        promedioCurso: "Curso",
        promedioCalidad: "Calidad",
        promedioComida: "Comida",
        promedioBaño: "Baño",
    };

    if (!data || Object.keys(data).length === 0) {
        return Object.fromEntries(Object.values(keyMap).map(key => [key, null]));
    }

    return Object.entries(data).reduce((acc, [key, value]) => {
        const normalizedKey = keyMap[key] || key;
        acc[normalizedKey] = (value && typeof value === 'object' && Object.keys(value).length === 0) ? null : value;
        return acc;
    }, {});
};

const loadTotalTimes = async (idEjecutivo, formatOrDefault) => {
    try {
        const dataTotal = await userTimes(idEjecutivo);
        console.log("Datos totales recibidos:", dataTotal);

        const tiempos = normalizeTotalTimes(dataTotal?.resultadosTiempos || {});
        
        if (Object.values(tiempos).every(val => val === null)) {
            toast.warning("No hay datos totales disponibles");
            return {};
        }

        return {
            cuentas: formatOrDefault(tiempos.tiempoCuentas),
            negociacion: formatOrDefault(tiempos.tiempoNegociaciones),
            titulares: formatOrDefault(tiempos.tiempoTitulares),
            conocidos: formatOrDefault(tiempos.tiempoConocidos),
            desconocidos: formatOrDefault(tiempos.tiempoDesconocidos),
            sinContacto: formatOrDefault(tiempos.tiempoSinContacto),
            Permiso: formatOrDefault(tiempos.tiempoPermiso),
            Curso: formatOrDefault(tiempos.tiempoCurso),
            Calidad: formatOrDefault(tiempos.tiempoCalidad),
            Comida: formatOrDefault(tiempos.tiempoComida),
            Baño: formatOrDefault(tiempos.tiempoBaño),
        };
    } catch (error) {
        toast.error(`Error al cargar datos totales: ${error.message}`);
        console.error("Error al cargar datos totales:", error);
        return {};
    }
};

const loadPromedioTimes = async (idEjecutivo, formatOrDefault) => {
    try {
        const dataPromedio = await userTimesPromedio(idEjecutivo);
        console.log("Datos de promedio recibidos:", dataPromedio);

        // Asumimos que los promedios vienen en una estructura diferente
        const promedios = normalizeAverageTimes(dataPromedio?.resultadosPromedios || dataPromedio || {});
        
        if (Object.values(promedios).every(val => val === null)) {
            toast.warning("No hay datos de promedios disponibles");
            return {};
        }

        return {
            cuentas: formatOrDefault(promedios.cuentas),
            negociacion: formatOrDefault(promedios.negociacion),
            titulares: formatOrDefault(promedios.titulares),
            conocidos: formatOrDefault(promedios.conocidos),
            desconocidos: formatOrDefault(promedios.desconocidos),
            sinContacto: formatOrDefault(promedios.sinContacto),
            Permiso: formatOrDefault(promedios.Permiso),
            Curso: formatOrDefault(promedios.Curso),
            Calidad: formatOrDefault(promedios.Calidad),
            Comida: formatOrDefault(promedios.Comida),
            Baño: formatOrDefault(promedios.Baño),
        };
    } catch (error) {
        toast.error(`Error al cargar datos de promedios: ${error.message}`);
        console.error("Error al cargar datos de promedios:", error);
        return {};
    }
};

const TableTimes = ({ updatedTimes }) => {
    const { idEjecutivo } = useContext(AppContext);

    const [timesData, setTimesData] = useState({
        total: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"])),
        promedio: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"]))
    });

    useEffect(() => {
        if (!idEjecutivo) return;

        const loadData = async () => {
            try {
                toast.info("Cargando datos...");
                const formatOrDefault = (time) => time ? formatTime(time) : "--:--:--";

                const [totalTimes, promedioTimes] = await Promise.all([
                    loadTotalTimes(idEjecutivo, formatOrDefault),
                    loadPromedioTimes(idEjecutivo, formatOrDefault)
                ]);

                setTimesData({
                    total: totalTimes,
                    promedio: promedioTimes
                });
                toast.success("Datos cargados correctamente");
            } catch (error) {
                toast.error("Error al cargar datos");
            }
        };

        loadData();
    }, [idEjecutivo]);

    useEffect(() => {
        if (!updatedTimes) return;

        setTimesData(prev => {
            const newTotal = { ...prev.total };

            Object.entries(updatedTimes).forEach(([key, value]) => {
                if (TIME_CATEGORIES.includes(key)) {
                    const dbValueInSeconds = prev.total[key] !== "--:--:--"
                        ? Number(prev.total[key].split(":").reduce((acc, time) => (60 * acc) + +time, 0))
                        : 0;
                    newTotal[key] = formatTime(dbValueInSeconds + Number(value));
                }
            });

            return { ...prev, total: newTotal };
        });
    }, [updatedTimes]);

    const renderRows = (type) => TIME_CATEGORIES.map((key) => (
        <td key={`${type}-${key}`} style={{ minWidth: "100px" }}>
            {timesData[type][key]}
        </td>
    ));

    if (!idEjecutivo) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                ⚠️ No se encontró un ID de ejecutivo válido
            </div>
        );
    }

    return (
        <Table responsive variant="dark" className="mt-3">
            <thead>
                <tr>
                    <th>Indicador</th>
                    {TIME_CATEGORIES.map(category => (
                        <th key={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</th>
                    ))}
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
    updatedTimes: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    )
};

export default TableTimes;