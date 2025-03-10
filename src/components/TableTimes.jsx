import React, { useEffect, useState } from 'react'; 
import { Table } from 'react-bootstrap';
import { userTimes } from '../services/gespawebServices';
import { toast } from 'sonner';  // Asumiendo que usas 'sonner' para las notificaciones

const TableTimes = () => {
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || 37940;



    const generateJsonData = () => {
        const savedTimes = JSON.parse(localStorage.getItem("timesData")) || {};
        
        return {
            numEmpleado: idEjecutivo,
            tiempos: {
                tiempoCuentas: savedTimes.cuentas || 0,
                tiempoNegociaciones: savedTimes.negociacion || 0,
                tiempoTitulares: savedTimes.titulares || 0,
                tiempoConocidos: savedTimes.conocidos || 0,
                tiempoDesconocidos: savedTimes.desconocidos || 0,
                tiempoSinContacto: savedTimes.sinContacto || 0,
                tiempoPermiso: savedTimes.permiso || 0,
                tiempoCurso: savedTimes.curso || 0,
                tiempoCalidad: savedTimes.calidad || 0,
                tiempoComida: savedTimes.comida || 0,
                tiempoBaño: savedTimes.baño || 0
            }
        };
    };
    
    // Para ver el JSON generado en la consola:
    // console.log(JSON.stringify(generateJsonData(), null, 2));
    
    
    // Estado inicial basado en localStorage
    const [timesData, setTimesData] = useState({
        total: {
            cuentas: '00:00:00',
            negociacion: '00:00:00',
            titulares: '00:00:00',
            conocidos: '00:00:00',
            desconocidos: '00:00:00',
            sinContacto: '00:00:00',
            permiso: '00:00:00',
            curso: '00:00:00',
            calidad: '00:00:00',
            comida: '00:00:00',
            baño: '00:00:00',
        },
        promedio: {
            cuentas: '00:00:00',
            negociacion: '00:00:00',
            titulares: '00:00:00',
            conocidos: '00:00:00',
            desconocidos: '00:00:00',
            sinContacto: '00:00:00',
            permiso: '00:00:00',
            curso: '00:00:00',
            calidad: '00:00:00',
            comida: '00:00:00',
            baño: '00:00:00',
        },
    });

    const formatTime = (seconds) => {
        if (!seconds) return '00:00:00';
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    useEffect(() => {
        const updateFromLocalStorage = () => {
            const savedTimes = JSON.parse(localStorage.getItem("timesData")) || {};
            setTimesData((prevData) => ({
                ...prevData,
                total: {
                    ...prevData.total,
                    permiso: formatTime(savedTimes.permiso),
                    curso: formatTime(savedTimes.curso),
                    calidad: formatTime(savedTimes.calidad),
                    comida: formatTime(savedTimes.comida),
                    baño: formatTime(savedTimes.baño),
                },
                promedio: {
                    ...prevData.promedio,
                    permiso: formatTime(savedTimes.permiso),
                    curso: formatTime(savedTimes.curso),
                    calidad: formatTime(savedTimes.calidad),
                    comida: formatTime(savedTimes.comida),
                    baño: formatTime(savedTimes.baño),
                }
            }));
        };

        updateFromLocalStorage(); // Cargar datos al inicio
        const interval = setInterval(updateFromLocalStorage, 100); // Actualizar cada 100ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (idEjecutivo) {
            console.log(`Consultando tiempos para el ejecutivo con ID: ${idEjecutivo}`);

            userTimes(idEjecutivo)
                .then((data) => {
             

                    if (!data || !data.resultadosTiempos) {
                        console.warn("La API no devolvió resultados válidos.");
                        toast.warning("No hay datos de tiempos disponibles.");
                        return;
                    }

                    const tiempos = data.resultadosTiempos;

                    setTimesData((prevData) => ({
                        ...prevData,
                        total: {
                            ...prevData.total,
                            cuentas: formatTime(tiempos.tiempoCuentas * 1000),
                            negociacion: formatTime(tiempos.tiempoNegociaciones * 1000),
                            titulares: formatTime(tiempos.tiempoTitulares * 1000),
                            conocidos: formatTime(tiempos.tiempoConocidos * 1000),
                            desconocidos: formatTime(tiempos.tiempoDesconocidos * 1000),
                            sinContacto: formatTime(tiempos.tiempoSinContacto * 1000),
                        },
                        promedio: {
                            ...prevData.promedio,
                            cuentas: formatTime(tiempos.tiempoCuentas * 1000),
                            negociacion: formatTime(tiempos.tiempoNegociaciones * 1000),
                            titulares: formatTime(tiempos.tiempoTitulares * 1000),
                            conocidos: formatTime(tiempos.tiempoConocidos * 1000),
                            desconocidos: formatTime(tiempos.tiempoDesconocidos * 1000),
                            sinContacto: formatTime(tiempos.tiempoSinContacto * 1000),
                        }
                    }));
                })
                .catch((error) => {
                    console.error("Error al obtener los tiempos:", error);
                    toast.error("Error al cargar los tiempos");
                });
        } else {
            console.warn("No se encontró un ID de ejecutivo válido.");
        }
    }, [idEjecutivo]);

    const renderRows = (type) => {
        return Object.keys(timesData[type]).map((key) => (
            <td key={key} style={{ minWidth: '100px' }}>{timesData[type][key]}</td>
        ));
    };

    return (
        <Table responsive variant="dark">
            <thead>
                <tr>
                    <th>Indicador</th>
                    <th style={{ minWidth: '100px' }}>Cuentas</th>
                    <th style={{ minWidth: '100px' }}>Negociación</th>
                    <th style={{ minWidth: '100px' }}>Titulares</th>
                    <th style={{ minWidth: '100px' }}>Conocidos</th>
                    <th style={{ minWidth: '100px' }}>Desconocidos</th>
                    <th style={{ minWidth: '100px' }}>Sin contacto</th>
                    <th style={{ minWidth: '100px' }}>Permiso</th>
                    <th style={{ minWidth: '100px' }}>Curso</th>
                    <th style={{ minWidth: '100px' }}>Calidad</th>
                    <th style={{ minWidth: '100px' }}>Comida</th>
                    <th style={{ minWidth: '100px' }}>Baño</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Total</th>
                    {renderRows('total')}
                </tr>
                <tr>
                    <th scope="row">Promedio</th>
                    {renderRows('promedio')}
                </tr>
            </tbody>
        </Table>
    );
    
};

export default TableTimes;