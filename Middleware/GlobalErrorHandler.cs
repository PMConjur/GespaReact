using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace NoriAPI.Middleware
{
    public class GlobalErrorHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalErrorHandler> _logger; // Logger inyectado para registrar los errores

        public GlobalErrorHandler(RequestDelegate next, ILogger<GlobalErrorHandler> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                // Registrar la excepción antes de manejarla
                _logger.LogError(ex, "An exception occurred: {Message}", ex.Message);

                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var statusCode = (int)HttpStatusCode.InternalServerError; // Por defecto, 500
            string message;
            string siteLink;

            switch (ex)
            {
                case ArgumentNullException:
                case ArgumentException:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    message = ex.Message;
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.5.1"; // Enlace específico para Bad Request
                    break;

                case InvalidOperationException:
                    statusCode = (int)HttpStatusCode.NotFound;
                    message = ex.Message;
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.5.2"; // Enlace específico para Not Found
                    break;

                case UnauthorizedAccessException:
                    statusCode = (int)HttpStatusCode.Unauthorized;
                    message = ex.Message;
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.5.3"; // Enlace específico para Unauthorized
                    break;

                case NotSupportedException:
                    statusCode = (int)HttpStatusCode.MethodNotAllowed;
                    message = ex.Message;
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.5.6"; // Enlace específico para Method Not Allowed
                    break;

                // Excepciones adicionales:
                case TimeoutException:
                    statusCode = (int)HttpStatusCode.RequestTimeout;
                    message = "La solicitud ha superado el tiempo límite.";
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.5.9"; // Enlace específico para Timeout
                    break;

                case SqlException: // Para errores de base de datos
                    statusCode = (int)HttpStatusCode.ServiceUnavailable;
                    message = $"Error en la base de datos: {ex.Message}";
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.6.4"; // Enlace específico para errores de servicio
                    break;

                default:
                    message = $"Ocurrió un error inesperado. {ex.Message}";
                    siteLink = "https://tools.ietf.org/html/rfc9110#section-15.5.4"; // Enlace general para errores no especificados
                    break;
            }

            var response = new
            {
                status = statusCode,
                title = ex.GetType().ToString(),
                type = siteLink,
                errors = message,
                traceId = context.TraceIdentifier
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            return context.Response.WriteAsJsonAsync(response);
        }

    }

    public static class GlobalErrorHandlerExtensions
    {
        public static IApplicationBuilder UseGlobalErrorHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GlobalErrorHandler>();
        }
    }
}
