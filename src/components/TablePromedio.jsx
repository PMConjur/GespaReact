// import { useState, useEffect, useContext } from "react";
// import PropTypes from "prop-types";
// import { Table } from "react-bootstrap";
// import { userTimes } from "../services/gespawebServices";
// import { toast } from "sonner";
// import { AppContext } from "../pages/Managment";
// //import "../../../scss/styles.scss";

// const TIME_CATEGORIES = [
//     'cuentas', 'negociacion', 'titulares', 
//     'conocidos', 'desconocidos', 'sinContacto',
//     'Permiso', 'Curso', 'Calidad', 'Comida', 'Baño'
// ];

// const formatTime = (value) => {
//     // Si ya está formateado (HH:MM:SS)
//     if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value)) {
//         return value;
//     }
    
//     // Si es null/undefined o no convertible a número
//     if (value == null || isNaN(Number(value))) {
//         return "--:--:--";
//     }
    
//     const seconds = Math.floor(Number(value));
//     const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
//     const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
//     const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    
//     return `${hrs}:${mins}:${secs}`;
// };

// const TableTimes = ({ updatedTimes }) => {
//     const { idEjecutivo } = useContext(AppContext);

//     const [timesData, setTimesData] = useState({
//         promedio: Object.fromEntries(TIME_CATEGORIES.map(cat => [cat, "--:--:--"]))
//     });

//     // Cargar datos iniciales
//     useEffect(() => {
//         if (!idEjecutivo) return;

//         const loadInitialData = async () => {
//             try {
//                 const data = await userTimes(idEjecutivo);
                
//                 if (!data?.resultadosTiempos) {
//                     toast.warning("No hay datos de tiempos disponibles");
//                     return;
//                 }

//                 const tiempos = data.resultadosTiempos;
                
//                 setTimesData({
//                     promedio: {
//                         cuentas: formatTime(tiempos.promedioCuentas),
//                         negociacion: formatTime(tiempos.promedioNegociaciones),
//                         titulares: formatTime(tiempos.promedioTitulares),
//                         conocidos: formatTime(tiempos.promedioConocidos),
//                         desconocidos: formatTime(tiempos.promedioDesconocidos),
//                         sinContacto: formatTime(tiempos.promedioSinContacto),
//                         Permiso: formatTime(tiempos.promedioPermiso),
//                         Curso: formatTime(tiempos.promedioCurso),
//                         Calidad: formatTime(tiempos.promedioCalidad),
//                         Comida: formatTime(tiempos.promedioComida),
//                         Baño: formatTime(tiempos.promedioBaño),
//                     }
//                 });
//             } catch (error) {
//                 toast.error(`Error al cargar tiempos: ${error.message}`);
//             }
//         };

//         loadInitialData();
//     }, [idEjecutivo]);

//     // Actualizar datos cuando cambia updatedTimes
//     useEffect(() => {
//         if (!updatedTimes) return;

//         setTimesData(prev => {
//             const newTotal = { ...prev.total };

//             // Actualizar y sumar los campos que vienen en updatedTimes
//             Object.entries(updatedTimes).forEach(([key, value]) => {
//                 if (TIME_CATEGORIES.includes(key)) {
//                     const dbValueInSeconds = prev.total[key] !== "--:--:--"
//                         ? Number(prev.total[key].split(":").reduce((acc, time) => (60 * acc) + +time, 0))
//                         : 0;
//                     newTotal[key] = formatTime(dbValueInSeconds + Number(value));
//                 }
//             });

//             return {
//                 ...prev,
//                 total: newTotal
//             };
//         });
//     }, [updatedTimes]);

//     const renderRows = (type) => {
//         return TIME_CATEGORIES.map((key) => (
//             <td key={`${type}-${key}`} style={{ minWidth: "100px" }}>
//                 {timesData[type][key]}
//             </td>
//         ));
//     };

//     if (!idEjecutivo) {
//         return (
//             <div className="alert alert-warning text-center" role="alert">
//                 ⚠️ No se encontró un ID de ejecutivo válido. Verifica tu sesión.
//             </div>
//         );
//     }

//     return (
//         <Table responsive variant="dark" className="mt-3">
//             <thead>
//                 <tr>
//                     <th>Indicador</th>
//                     {TIME_CATEGORIES.map(category => (
//                         <th key={category} style={{ minWidth: "100px" }}>
//                             {category.charAt(0).toUpperCase() + category.slice(1)}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <th scope="row">Total</th>
//                     {renderRows("total")}
//                 </tr>
//                 <tr>
//                     <th scope="row">Promedio</th>
//                     {renderRows("promedio")}
//                 </tr>
//             </tbody>
//         </Table>
//     );
// };

// TableTimes.propTypes = {
//     updatedTimes: PropTypes.shape(
//         Object.fromEntries(
//             TIME_CATEGORIES.map(cat => [cat, PropTypes.oneOfType([
//                 PropTypes.string,
//                 PropTypes.number
//             ])])
//         )
//     )
// };

// export default TableTimes;