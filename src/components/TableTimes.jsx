import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import { userTimes, userTimesPromedio } from "../services/gespawebServices";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";

const TIME_CATEGORIES = [
    'Cuentas', 'negociacion', 'Titulares', 
    'Conocidos', 'desconocidos', 'sinContacto',
    'Permiso', 'Curso', 'Calidad', 'Comida', 'Baño'
];

const formatTime = (value) => {
    // Caso 1: Valor ya formateado correctamente (HH:MM:SS)
    if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value)) {
        return value;
    }
    
    // Caso 2: Valor con milisegundos (HH:MM:SS.milliseconds)
    if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}\.\d+$/.test(value)) {
        return value.split('.')[0]; // Elimina los milisegundos
    }
    
    // Caso 3: Valor en segundos (número)
    if (!isNaN(Number(value))) {
        const seconds = Math.floor(Number(value));
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    }
    
    // Caso 4: Valor inválido
    console.warn("Valor no válido recibido para formato de tiempo:", value);
    return "--:--:--";
};

// Función para cargar datos totales
const loadTotalTimes = async (idEjecutivo, formatOrDefault) => {
    try {
        const dataTotal = await userTimes(idEjecutivo);
        console.log("Datos totales CRUDOS:", dataTotal); // <-- Añadir aquí
        console.log("Estructura resultadosTiempos:", dataTotal?.resultadosTiempos); // <-- Añadir aquí

        const tiempos = dataTotal?.resultadosTiempos || {};
        console.log("Datos a normalizar:", tiempos); // <-- Añadir aquí
        if (Object.keys(tiempos).length === 0) {
            toast.warning("No hay datos totales disponibles");
            console.warn("No se encontraron datos totales disponibles");
            return {};
        }

        return {
            Cuentas: formatOrDefault(tiempos.tiempoCuentas),
            negociacion: formatOrDefault(tiempos.tiempoNegociaciones),
            Titulares: formatOrDefault(tiempos.tiempoTitulares),
            Conocidos: formatOrDefault(tiempos.tiempoConocidos),
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

// Función para normalizar claves de PascalCase a camelCase
const normalizeKeys = (data) => {
    const keyMap = {
        TiempoCuentas: "tiempoCuentas",
        TiempoNegociaciones: "tiempoNegociaciones",
        TiempoTitulares: "tiempoTitulares",
        TiempoConocidos: "tiempoConocidos",
        TiempoDesconocidos: "tiempoDesconocidos",
        TiempoSinContacto: "tiempoSinContacto",
        TiempoPermiso: "tiempoPermiso",
        TiempoCurso: "tiempoCurso",
        TiempoCalidad: "tiempoCalidad",
        TiempoComida: "tiempoComida",
        TiempoBaño: "tiempoBaño",
    };

    // Si es un objeto vacío, devolver un objeto con todas las claves como null
    if (!data || Object.keys(data).length === 0) {
        return Object.fromEntries(Object.values(keyMap).map(key => [key, null]));
    }

    // Si es un objeto con datos, normalizar las claves
    return Object.entries(data).reduce((acc, [key, value]) => {
        const normalizedKey = keyMap[key] || key;
        // Manejar objetos vacíos como valores
        acc[normalizedKey] = (value && typeof value === 'object' && Object.keys(value).length === 0) ? null : value;
        return acc;
    }, {});
};

// Función para cargar datos de promedios
const loadPromedioTimes = async (idEjecutivo, formatOrDefault) => {
    try {
        const dataPromedio = await userTimesPromedio(idEjecutivo);
        console.log("Datos promedio CRUDOS:", dataPromedio); // <-- Añadir aquí
        console.log("Estructura resultadosTiempos:", dataPromedio.resultadosTiempos); // <-- Añadir aquí

        // Verificar si los datos vienen directamente en la respuesta o en resultadosTiempos
        const promediosData = dataPromedio.resultadosTiempos || dataPromedio;
        
        const promedios = normalizeKeys(promediosData);
        
        // Verificar si realmente tenemos datos (no solo objetos vacíos)
        const hasValidData = Object.values(promedios).some(
            val => val !== null && val !== undefined && !(typeof val === 'object' && Object.keys(val).length === 0)
        );
        
        if (!hasValidData) {
            toast.warning("No hay datos de promedios disponibles");
            console.warn("No se encontraron datos de promedios disponibles");
            return {};
        }

        return {
            Cuentas: formatOrDefault(promedios.tiempoCuentas),
            negociacion: formatOrDefault(promedios.tiempoNegociaciones),
            Titulares: formatOrDefault(promedios.tiempoTitulares),
            Conocidos: formatOrDefault(promedios.tiempoConocidos),
            desconocidos: formatOrDefault(promedios.tiempoDesconocidos),
            sinContacto: formatOrDefault(promedios.tiempoSinContacto),
            Permiso: formatOrDefault(promedios.tiempoPermiso),
            Curso: formatOrDefault(promedios.tiempoCurso),
            Calidad: formatOrDefault(promedios.tiempoCalidad),
            Comida: formatOrDefault(promedios.tiempoComida),
            Baño: formatOrDefault(promedios.tiempoBaño),
        };
    } catch (error) {
        toast.error(`Error al cargar datos de promedios: ${error.message}`);
        console.error("Error al cargar datos de promedios:", error);
        return {};
    }
};

const TableTimes = ({ updatedTimes }) => {
    const { idEjecutivo } = useContext(AppContext);
    
    const toastShownRef = useRef(false); // Nuevo useRef
    
    const [timesData, setTimesData] = useState({
        total: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"])),
        promedio: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"]))
    });

    // Cargar datos iniciales
    useEffect(() => {
        if (!idEjecutivo) return;

        const loadInitialData = async () => {

            const formatOrDefault = (time) => time ? formatTime(time) : "--:--:--";

            const totalTimes = await loadTotalTimes(idEjecutivo, formatOrDefault);
            const promedioTimes = await loadPromedioTimes(idEjecutivo, formatOrDefault);

            setTimesData({
                total: totalTimes,
                promedio: promedioTimes,
            });

            
        };

        loadInitialData();
    }, [idEjecutivo]);

    // Actualizar datos cuando cambia updatedTimes
    useEffect(() => {
        if (!updatedTimes || Object.keys(updatedTimes).length === 0) return;
        
        let hasUpdates = false;
        const newTotal = { ...timesData.total };
    
        Object.entries(updatedTimes).forEach(([key, value]) => {
            if (TIME_CATEGORIES.includes(key)) {
                const dbValueInSeconds = newTotal[key] !== "--:--:--"
                    ? Number(newTotal[key].split(":").reduce((acc, time) => (60 * acc) + +time, 0))
                    : 0;
                newTotal[key] = formatTime(dbValueInSeconds + Number(value));
                hasUpdates = true;
            }
        });

        if (hasUpdates && !toastShownRef.current) {
            toast.success("Datos actualizados correctamente");
            toastShownRef.current = true;
        }
    
        setTimesData(prev => ({
            ...prev,
            total: newTotal
        }));
    }, [updatedTimes]);

    
    const renderRows = (type) => {
        return TIME_CATEGORIES.map((key) => (
            <td key={`${type}-${key}`} style={{ minWidth: "100px" }}>
                {timesData[type][key]}
            </td>
        ));
    };

    if (!idEjecutivo) {
        toast.warning("No se encontró un ID de ejecutivo válido");
        console.warn("No se encontró un ID de ejecutivo válido");
        return (
            <div className="alert alert-warning text-center" role="alert">
                ⚠️ No se encontró un ID de ejecutivo válido. Verifica tu sesión.
            </div>
        );
    }
    

    return (
        <Table responsive variant="dark" className="mt-3">
            <thead>
                <tr>
                    <th>Indicador</th>
                    {TIME_CATEGORIES.map(category => (
                        <th key={category} style={{ minWidth: "100px" }}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </th>
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
    updatedTimes: PropTypes.shape(
        Object.fromEntries(
            TIME_CATEGORIES.map(cat => [cat, PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ])])
        )
    )
};


export default TableTimes;