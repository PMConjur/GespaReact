using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {

        Task<TiemposEjecutivo> ValidateTimes(int numEmpleado);
        Task<string> PauseUnpause(InfoPausa pausa);
        Task ObtenerSeguimientos(DataRow drDatos, DataSet dsTablas);
        Task ObtenerAccionamiento(DataRow drDatos, DataSet dsTablas);
    }



    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;
        private readonly string _connectionString;


        public EjecutivoService(IConfiguration configuration, IEjecutivoRepository ejecutivoRepository)
        {
            _configuration = configuration;
            _ejecutivoRepository = ejecutivoRepository;
            _connectionString = _configuration.GetConnectionString("Piso2Amex");
        }



        public async Task<TiemposEjecutivo> ValidateTimes(int numEmpleado)
        {
            ResultadoTiempos tiempos = null;

            try
            {
                var validateTimes = await _ejecutivoRepository.ValidateTimes(numEmpleado);
                tiempos = validateTimes;

            }
            catch (Exception ex)
            {
                return new TiemposEjecutivo($"Hubo un problema al obtener los tiempos del ejecutivo: {ex.Message} ", null);
            }

            return new TiemposEjecutivo(null, tiempos);



            // var resultadoTiempos = new TiemposEjecutivo(mensaje);
            //return validateTimes;


        }

        public async Task<string> PauseUnpause(InfoPausa pausa)
        {
            try
            {
                // Intenta despausar al ejecutivo validando su contraseña.
                // Si la contraseña es incorrecta, retorna un mensaje de error.
                if (!await Despausar(pausa))
                {
                    return "Contraseña Incorrecta.";
                }

                // Cambia el modo del ejecutivo a "Consulta".
                await _ejecutivoRepository.ChangeEjecutivoMode(pausa.IdEjecutivo, "Consulta");

                // Registra la pausa del ejecutivo en la base de datos con el idCatálogo1 3001 y la duración especificada.
                // TODO: Asignar propiamente los valores del idCatalogo según el valor de PeCausa.
                await _ejecutivoRepository.Pausa210(pausa.IdEjecutivo, 3001, pausa.Duracion);

                // Aumenta el tiempo de actividad del ejecutivo con la duración de la pausa y la causa asociada.
                await _ejecutivoRepository.IncreaseEjecutivoTime(pausa.IdEjecutivo, pausa.Duracion, pausa.PeCausa);
            }
            catch
            {
                // Si ocurre un error en cualquier parte del proceso, devuelve un mensaje de error.
                return "Ocurrió un error al reanudar la sesión.";
            }

            // Retorna una cadena vacía si todo el proceso se ejecutó correctamente.
            return "";
        }

        private async Task<bool> Despausar(InfoPausa tiempos)
        {
            // Valida la contraseña del ejecutivo en la base de datos.
            var validatePass = await _ejecutivoRepository.ValidatePasswordEjecutivo(tiempos.IdEjecutivo, tiempos.Contrasenia);

            // Si la validación falla (es nula), retorna false indicando que la contraseña es incorrecta.
            if (validatePass is null)
            {
                return false;
            }

            // Si la validación es exitosa, retorna true.
            return true;
        }
        public async Task<DataTable> GetSeguimientosAsync(int idCartera,string idCuenta)
        {
            DataTable seguimiento = new DataTable();
            string query = "SELECT * FROM fn_Seguimientos(@idCartera, @idCuenta)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(seguimiento);
                    }
                }
            }
            return seguimiento;
        }

        public async Task ObtenerSeguimientos(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            // Verifica que drDatos tenga las columnas 'idCartera' y 'idCuenta'
            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable seguimientosGet = await GetSeguimientosAsync(idCartera, idCuenta);

            if (seguimientosGet == null || seguimientosGet.Rows.Count == 0)
                return;

            // Si la tabla ya existe, elimínala antes de agregar la nueva
            if (dsTablas.Tables.Contains("Seguimiento"))
            {
                dsTablas.Tables.Remove("Seguimiento");
            }

            seguimientosGet.TableName = "Seguimiento";
            dsTablas.Tables.Add(seguimientosGet);
        }
        public async Task<DataTable> GetAccionamientoAsync(int idCartera, string idCuenta)
        {
            DataTable accionamiento = new DataTable();
            string query = "SELECT * FROM fn_Accionamientos(@idCartera, @idCuenta)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(accionamiento);
                    }
                }
            }
            return accionamiento;
        }

        public async Task ObtenerAccionamiento(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;
            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable accionamientoGet = await GetAccionamientoAsync(idCartera, idCuenta);

            if (accionamientoGet == null || accionamientoGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Accionamiento"))
            {
                dsTablas.Tables.Remove("Accionamiento");
            }

            accionamientoGet.TableName = "Accionamiento"; 
            dsTablas.Tables.Add(accionamientoGet);
        }




    }
}
