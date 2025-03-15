using Microsoft.Data.SqlClient;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public static class SqlParameterExtensions
    {
        public static void AddParameterWithValueOrDbNull(this SqlParameterCollection parameters, string parameterName, object value)
        {
            parameters.AddWithValue(parameterName, value ?? DBNull.Value);
        }
    }
}
