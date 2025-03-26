import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import { userTimes } from "../services/gespawebServices";
import { toast } from "sonner";
import { AppContext } from "../pages/Managment";

const TIME_CATEGORIES = [
    'cuentas', 'negociacion', 'titulares', 
    'conocidos', 'desconocidos', 'sinContacto',
    'Permiso', 'Curso', 'Calidad', 'Comida', 'Baño'
];

const TableTimes = ({ updatedTimes }) => {
    const { idEjecutivo } = useContext(AppContext);

    const [timesData, setTimesData] = useState({
        total: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"])),
        promedio: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"]))
    });

    useEffect(() => {
        if (!idEjecutivo) return;

        const fetchTimes = async () => {
            try {
                const data = await userTimes(idEjecutivo);
                
                if (!data || !data.resultadosTiempos) {
                    toast.warning("No hay datos de tiempos disponibles");
                    return;
                }

                const tiempos = data.resultadosTiempos;
                
                setTimesData({
                    total: {
                        cuentas: tiempos.tiempoCuentas || "--:--:--",
                        negociacion: tiempos.tiempoNegociaciones || "--:--:--",
                        titulares: tiempos.tiempoTitulares || "--:--:--",
                        conocidos: tiempos.tiempoConocidos || "--:--:--",
                        desconocidos: tiempos.tiempoDesconocidos || "--:--:--",
                        sinContacto: tiempos.tiempoSinContacto || "--:--:--",
                        Permiso: tiempos.tiempoPermiso || "--:--:--",
                        Curso: tiempos.tiempoCurso || "--:--:--",
                        Calidad: tiempos.tiempoCalidad || "--:--:--",
                        Comida: tiempos.tiempoComida || "--:--:--",
                        Baño: tiempos.tiempoBaño || "--:--:--",
                    },
                    promedio: {
                        cuentas: tiempos.promedioCuentas || "--:--:--",
                        negociacion: tiempos.promedioNegociaciones || "--:--:--",
                        titulares: tiempos.promedioTitulares || "--:--:--",
                        conocidos: tiempos.promedioConocidos || "--:--:--",
                        desconocidos: tiempos.promedioDesconocidos || "--:--:--",
                        sinContacto: tiempos.promedioSinContacto || "--:--:--",
                        Permiso: tiempos.promedioPermiso || "--:--:--",
                        Curso: tiempos.promedioCurso || "--:--:--",
                        Calidad: tiempos.promedioCalidad || "--:--:--",
                        Comida: tiempos.promedioComida || "--:--:--",
                        Baño: tiempos.promedioBaño || "--:--:--",
                    }
                });
            } catch (error) {
                toast.error(`Error al cargar tiempos: ${error.message}`);
            }
        };

        fetchTimes();
    }, [idEjecutivo]);

    useEffect(() => {
        if (updatedTimes) {
            setTimesData(prev => ({
                ...prev,
                total: {
                    ...prev.total,
                    ...updatedTimes
                }
            }));
        }
    }, [updatedTimes]);

    const renderRows = (type) => {
        return TIME_CATEGORIES.map((key) => (
            <td key={key} style={{ minWidth: "100px" }}>{timesData[type][key]}</td>
        ));
    };

    if (!idEjecutivo) {
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
    updatedTimes: PropTypes.object,
};

export default TableTimes;