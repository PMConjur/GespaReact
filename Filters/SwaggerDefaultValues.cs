using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace NoriAPI.Swagger.Filters
{
    public class SwaggerDefaultValues : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Si no hay parámetros de respuesta definidos, agrega uno para un caso de éxito
            if (operation.Responses.Count == 0)
            {
                operation.Responses.Add("200", new OpenApiResponse { Description = "Operación exitosa" });
            }

            // Marca como requerido el parámetro de autorización si no está marcado
            var authorizeAttribute = context.ApiDescription.ActionDescriptor.EndpointMetadata
                .OfType<AuthorizeAttribute>()
                .FirstOrDefault();

            if (authorizeAttribute != null)
            {
                var bearer = new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                };
                operation.Security = new List<OpenApiSecurityRequirement> { bearer };
            }

            // Configurar los parámetros de paginación predeterminados, si aplica
            foreach (var parameter in operation.Parameters)
            {
                if (parameter.Name == "page" && parameter.Description == null)
                {
                    parameter.Description = "Número de página para paginación";
                    parameter.Required = false;
                }

                if (parameter.Name == "pageSize" && parameter.Description == null)
                {
                    parameter.Description = "Número de elementos por página";
                    parameter.Required = false;
                }
            }
        }
    }
}
