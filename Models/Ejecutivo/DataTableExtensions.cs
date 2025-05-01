using System;
using System.Data;
using System.Reflection;
namespace NoriAPI.Models.Ejecutivo
{
    public static class DataTableExtensions
    {
        public static DataTable ToDataTable<T>(this T[] array) where T : class
        {
            DataTable dt = new DataTable(typeof(T).Name);
            PropertyInfo[] properties = typeof(T).GetProperties();

            // Agregar columnas basadas en las propiedades del objeto Plazos
            foreach (PropertyInfo property in properties)
            {
                dt.Columns.Add(property.Name, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
            }

            // Agregar filas basadas en los elementos del arreglo Plazos
            foreach (T item in array)
            {
                DataRow row = dt.NewRow();
                foreach (PropertyInfo property in properties)
                {
                    row[property.Name] = property.GetValue(item, null) ?? DBNull.Value;
                }
                dt.Rows.Add(row);
            }

            return dt;
        }

    }
}
