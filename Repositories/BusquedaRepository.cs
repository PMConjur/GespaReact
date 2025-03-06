using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models;
using System.Data;

namespace NoriAPI.Repositories
{
    public interface IBusquedaRepository
    {
        Task<bool> GuardaBusquedaAsync(BusquedaClass busqueda, int idCartera, string idCuenta, int idEjecutivo, TimeSpan tiempoEnCuenta);
        string GuardaNuevoTelefono(Telefono telefono, bool esNuevo);
        DataTable Búsquedas { get; }

    }
    public class BusquedaRepository : IBusquedaRepository
    {
        private readonly string _connectionString;
        public DataTable Búsquedas { get; set; } = new DataTable();


        public BusquedaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Piso2Amex");
        }

        public async Task<bool> GuardaBusquedaAsync(BusquedaClass busqueda, int idCartera, string idCuenta, int idEjecutivo, TimeSpan tiempoEnCuenta)
        {
            if (busqueda == null)
                throw new ArgumentNullException(nameof(busqueda), "El objeto búsqueda no puede ser null");

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Validar si la búsqueda ya existe hoy
                    string fechaHoy = DateTime.UtcNow.ToString("yyyy-MM-dd");

                    using (var checkCommand = new SqlCommand(
                        "SELECT COUNT(*) FROM Busquedas WHERE Fecha_Insert = @FechaHoy AND idDato = @idDato AND idFuente = @idFuente AND idEjecutivo = @idEjecutivo",
                        connection))
                    {
                        checkCommand.Parameters.AddWithValue("@FechaHoy", fechaHoy);
                        checkCommand.Parameters.AddWithValue("@idDato", busqueda.idDato);
                        checkCommand.Parameters.AddWithValue("@idFuente", busqueda.idFuente);
                        checkCommand.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);

                        int count = (int)await checkCommand.ExecuteScalarAsync();
                        if (count > 0)
                            return false; // Ya existe una búsqueda con esos datos hoy
                    }

                    // Guardar nuevos teléfonos antes de registrar la búsqueda
                    if (busqueda.Teléfonos != null)
                    {
                        foreach (var telefono in busqueda.Teléfonos)
                        {
                            string mensaje = GuardaNuevoTelefono(telefono, true);
                            if (!string.IsNullOrEmpty(mensaje))
                                return false; // Error al guardar teléfono
                        }
                    }

                    // Insertar nueva búsqueda
                    using (var command = new SqlCommand("EXEC [2.9.Búsqueda] @idCartera, @idCuenta, @idEjecutivo, @idDato, @DatoBuscado, @idFuente, @Encontrado, @Telefonos, @Persona, @Puesto, @Lugar, NULL, @TiempoEnCuenta, @link, @validador", connection))
                    {
                        command.Parameters.AddWithValue("@idCartera", idCartera);
                        command.Parameters.AddWithValue("@idCuenta", idCuenta?.Trim() ?? string.Empty);
                        command.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);
                        command.Parameters.AddWithValue("@idDato", busqueda.idDato);

                        // Validación de teléfonos para evitar errores
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
                        command.Parameters.AddWithValue("@TiempoEnCuenta", tiempoEnCuenta);
                        command.Parameters.AddWithValue("@link", busqueda.Link ?? string.Empty);
                        command.Parameters.AddWithValue("@validador", (object?)busqueda.validador ?? DBNull.Value);

                        return await command.ExecuteNonQueryAsync() > 0;
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"Error en SQL: {sqlEx.Message}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general: {ex.Message}");
                return false;
            }
        }

        public string GuardaNuevoTelefono(Telefono telefono, bool esNuevo)
        {
            if (telefono == null)
                return "El teléfono no puede ser null.";

            // Validación de número telefónico (por ejemplo, asegurarse de que el número tenga el formato adecuado)
            if (string.IsNullOrWhiteSpace(telefono.NúmeroTelefónico) || telefono.NúmeroTelefónico.Length < 10)
            {
                return "Número telefónico inválido o incompleto.";
            }

            // Si el teléfono es nuevo, guardarlo en la base de datos
            if (esNuevo)
            {
                try
                {
                    // Aquí iría la lógica para guardar el teléfono en la base de datos.
                    // Ejemplo de llamada a un repositorio o servicio para agregar el teléfono.
                    using (var connection = new SqlConnection(_connectionString))
                    {
                        connection.Open();
                        using (var command = new SqlCommand("INSERT INTO Telefonos (NumeroTelefonico, Estado) VALUES (@NumeroTelefonico, @Estado)", connection))
                        {
                            command.Parameters.AddWithValue("@NumeroTelefonico", telefono.NúmeroTelefónico);
                            // Se puede asignar un valor predeterminado si no está presente.

                            int rowsAffected = command.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                // Si se insertó correctamente, retornar vacío (sin errores)
                                return "";
                            }
                            else
                            {
                                return "No se pudo guardar el teléfono.";
                            }
                        }
                    }
                }
                catch (SqlException ex)
                {
                    // Manejo de excepciones relacionadas con SQL
                    Console.WriteLine($"Error de base de datos: {ex.Message}");
                    return "Error al guardar teléfono en la base de datos.";
                }
                catch (Exception ex)
                {
                    // Manejo de excepciones generales
                    Console.WriteLine($"Error inesperado: {ex.Message}");
                    return "Error inesperado al guardar el teléfono.";
                }
            }
            else
            {
                // Si no es un teléfono nuevo, realizar una actualización
                try
                {
                    // Lógica para actualizar el teléfono en la base de datos.
                    using (var connection = new SqlConnection(_connectionString))
                    {
                        connection.Open();
                        using (var command = new SqlCommand("UPDATE Telefonos SET Estado = @Estado WHERE NumeroTelefonico = @NumeroTelefonico", connection))
                        {
                            command.Parameters.AddWithValue("@NumeroTelefonico", telefono.NúmeroTelefónico);

                            int rowsAffected = command.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                return ""; // Si la actualización fue exitosa, retornamos vacío
                            }
                            else
                            {
                                return "No se encontró el teléfono para actualizar.";
                            }
                        }
                    }
                }
                catch (SqlException ex)
                {
                    Console.WriteLine($"Error de base de datos: {ex.Message}");
                    return "Error al actualizar teléfono en la base de datos.";
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error inesperado: {ex.Message}");
                    return "Error inesperado al actualizar el teléfono.";
                }
            }
        }




    }
}
