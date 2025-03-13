using System.Collections.Generic;
using System.Data;

namespace NoriAPI.Models.Ejecutivo
{

    public class Ejecutivo
    {
        public Dictionary<string, object> Datos { get; set; }

        public Ejecutivo(DataRow drEjecutivo)
        {
            Datos = new Dictionary<string, object>();
            foreach (DataColumn column in drEjecutivo.Table.Columns)
            {
                Datos[column.ColumnName] = drEjecutivo[column];
            }
        }
        public string Id { get; set; }
        public string Nombre { get; set; }

    }
}

