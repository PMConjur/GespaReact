using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Linq;
using System.Reflection;

public class SwaggerIgnoreFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (schema?.Properties == null || context.Type == null)
            return;

        // Buscar propiedades con el atributo [SwaggerIgnore]
        var ignoredProperties = context.Type
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(prop => prop.GetCustomAttribute<SwaggerIgnoreAttribute>() != null);

        // Eliminar esas propiedades del esquema de Swagger
        foreach (var prop in ignoredProperties)
        {
            var propertyName = schema.Properties.Keys
                .FirstOrDefault(p => string.Equals(p, prop.Name, StringComparison.OrdinalIgnoreCase));

            if (propertyName != null)
            {
                schema.Properties.Remove(propertyName);
            }
        }
    }
}
