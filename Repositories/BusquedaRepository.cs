using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models;
using System.Data;
using System.Transactions;

namespace NoriAPI.Repositories
{
    public interface IBusquedaRepository
    {
        Task<bool> GuardaBusquedaAsync(BusquedaClass busqueda, int idCartera, string idCuenta, int idEjecutivo, TimeSpan tiempoEnCuenta);
        string GuardaNuevoTelefono(Telefono telefono, bool esNuevo, SqlConnection connection, SqlTransaction transaction );
        DataTable Búsquedas { get; }
    }

    public class BusquedaRepository : IBusquedaRepository
    {
        private readonly string _connectionString;
        public DataTable Búsquedas { get; set; } = new DataTable();

        public BusquedaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Piso2Amex");
            Búsquedas = new DataTable();
            Búsquedas.Columns.Add("idDato", typeof(int));
            Búsquedas.Columns.Add("idFuente", typeof(int));
            Búsquedas.Columns.Add("idEjecutivo", typeof(int));
            Búsquedas.Columns.Add("Fecha_Insert", typeof(DateTime));
            Búsquedas.Columns.Add("Segundo_Insert", typeof(TimeSpan));
        }

        public async Task<bool> GuardaBusquedaAsync(BusquedaClass busqueda, int idCartera, string idCuenta, int idEjecutivo, TimeSpan tiempoEnCuenta)
        {
            if (busqueda == null)
                throw new ArgumentNullException(nameof(busqueda), "El objeto búsqueda no puede ser null");

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Validar si la búsqueda ya existe hoy
                        string fechaHoy = DateTime.UtcNow.ToString("yyyy-MM-dd");

                        using (var checkCommand = new SqlCommand(
                            "SELECT COUNT(*) FROM Busquedas WHERE Fecha_Insert = @FechaHoy AND idDato = @idDato AND idFuente = @idFuente AND idEjecutivo = @idEjecutivo",
                            connection, transaction))
                        {
                            checkCommand.Parameters.AddWithValue("@FechaHoy", fechaHoy);
                            checkCommand.Parameters.AddWithValue("@idDato", busqueda.idDato);
                            checkCommand.Parameters.AddWithValue("@idFuente", busqueda.idFuente);
                            checkCommand.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);

                            int count = (int)await checkCommand.ExecuteScalarAsync();
                            if (count > 0)
                            {
                                transaction.Rollback();
                                return false; // Ya existe una búsqueda con esos datos hoy
                            }
                        }

                        // Insertar nueva búsqueda
                        using (var command = new SqlCommand("EXEC [2.9.Búsqueda] @idCartera, @idCuenta, @idEjecutivo, @idDato, @DatoBuscado, @idFuente, @Encontrado, @Telefonos, @Persona, @Puesto, @Lugar, NULL, @TiempoEnCuenta, @link, @validador;", connection, transaction))
                        {
                            command.Parameters.AddWithValue("@idCartera", idCartera);
                            command.Parameters.AddWithValue("@idCuenta", idCuenta?.Trim() ?? string.Empty);
                            command.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);
                            command.Parameters.AddWithValue("@idDato", busqueda.idDato);

                            string datoBuscado = busqueda.idFuente == 2420 && busqueda.Teléfonos != null && busqueda.Teléfonos.Length > 0
                                ? $"XXX-XXX-{busqueda.Teléfonos[0].NúmeroTelefónico.Substring(6, 4)}"
                                : busqueda.Dato ?? string.Empty;

                            command.Parameters.AddWithValue("@DatoBuscado", datoBuscado);
                            command.Parameters.AddWithValue("@idFuente", busqueda.idFuente);
                            command.Parameters.AddWithValue("@Encontrado", busqueda.Encontrado);
                            command.Parameters.AddWithValue("@Telefonos", busqueda.Teléfonos?.Length ?? 0);
                            command.Parameters.AddWithValue("@Persona", busqueda.Persona ?? string.Empty);
                            command.Parameters.AddWithValue("@Puesto", busqueda.Puesto ?? string.Empty);
                            command.Parameters.AddWithValue("@Lugar", busqueda.Lugar ?? string.Empty);
                            command.Parameters.AddWithValue("@TiempoEnCuenta", tiempoEnCuenta.ToString(@"hh\:mm\:ss"));
                            command.Parameters.AddWithValue("@link", busqueda.Link ?? string.Empty);
                            command.Parameters.AddWithValue("@validador", (object?)busqueda.validador ?? DBNull.Value);

                            await command.ExecuteNonQueryAsync(); // Ejecutar sin recuperar idBusqueda
                        }

                        // Obtener el último id insertado
                        int idBusqueda = 0;
                        using (var idCommand = new SqlCommand("SELECT IDENT_CURRENT('Busquedas')", connection, transaction))
                        {
                            idBusqueda = Convert.ToInt32(await idCommand.ExecuteScalarAsync());
                        }

                        // Guardar nuevos teléfonos
                        if (busqueda.Teléfonos != null && busqueda.Teléfonos.Length > 0)
                        {
                            foreach (var telefono in busqueda.Teléfonos)
                            {
                                string mensaje = GuardaNuevoTelefono(telefono, true, connection, transaction);
                                if (!string.IsNullOrEmpty(mensaje))
                                {
                                    transaction.Rollback();
                                    return false; // Error al guardar teléfono, rollback
                                }
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (SqlException sqlEx)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error en SQL: {sqlEx.Number} - {sqlEx.Message} - idCartera: {idCartera}, idCuenta: {idCuenta}, idEjecutivo: {idEjecutivo}, idDato: {busqueda.idDato}, idFuente: {busqueda.idFuente}, validador: {busqueda.validador}");
                        return false;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error general: {ex.Message}");
                        return false;
                    }
                }
            }
        }

        public string GuardaNuevoTelefono(Telefono telefono, bool esNuevo, SqlConnection connection, SqlTransaction transaction)
        {
            if (telefono == null || string.IsNullOrWhiteSpace(telefono.NúmeroTelefónico) || telefono.NúmeroTelefónico.Length != 10)
            {
                return "Número telefónico inválido o incompleto.";
            }

            try
            {
                using (var command = new SqlCommand("INSERT INTO Telefonos (NumeroTelefonico ) VALUES (@NumeroTelefonico)", connection, transaction))
                {
                    command.Parameters.AddWithValue("@NumeroTelefonico", telefono.NúmeroTelefónico);
                    
                    command.ExecuteNonQuery();
                }
                return "";
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Error de base de datos al guardar teléfono: {ex.Number} - {ex.Message} - NumeroTelefonico: {telefono.NúmeroTelefónico}");
                return "Error al guardar teléfono en la base de datos.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inesperado al guardar teléfono: {ex.Message}");
                return "Error inesperado al guardar el teléfono.";
            }
        }

    }
}
