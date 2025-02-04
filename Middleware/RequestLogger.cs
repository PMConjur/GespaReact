using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;  // Para manejar solicitudes y respuestas HTTP.
using Microsoft.Extensions.Logging;
using Serilog;  // Para usar Serilog en nuestro middleware.
using System;  // Para manejar excepciones.
using System.Threading.Tasks;  // Para trabajar con operaciones asíncronas (async/await).


namespace NoriAPI.Middleware
{
    /// <summary> Middleware para Logging de las solicitudes entrantes y salientes. Un middleware es un componente de software que procesa las solicitudes HTTP en una aplicación ASP.NET Core. Cada middleware en la aplicación puede: Inspeccionar / modificar la solicitud antes de pasarla al siguiente middleware. - Hacer algo con la respuesta antes de devolverla al cliente. - Manejar excepciones o errores.</summary>
    public class RequestLogger
    {
        private readonly RequestDelegate _next; // Delegado que representa la siguiente pieza de middleware en la tubería
        private readonly ILogger<RequestLogger> _logger; // Logger para registrar las solicitudes y respuestas

        // Constructor que inyecta el middleware y el logger
        public RequestLogger(RequestDelegate next, ILogger<RequestLogger> logger)
        {
            _next = next; // Almacena el middleware siguiente
            _logger = logger; // Almacena el logger inyectado
        }

        // Método que se ejecuta en cada solicitud HTTP
        public async Task InvokeAsync(HttpContext httpContext)
        {
            // Registrar la solicitud.
            _logger.LogInformation("Request: {Method} {Url} from {Ip}",
                httpContext.Request.Method, httpContext.Request.Path, httpContext.Connection.RemoteIpAddress);



            await _next(httpContext); // Llamar al siguiente middleware

            // Registrar la respuesta
            _logger.LogInformation("Response: {StatusCode}", httpContext.Response.StatusCode);
        }
    }

    public static class RequestLoggerExtensions
    {
        public static IApplicationBuilder UseRequestLogger(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestLogger>();
        }
    }
}

