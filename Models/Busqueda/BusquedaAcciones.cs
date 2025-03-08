using System;

namespace NoriAPI.Models.Busqueda
{
    public class BusquedaClass
    {
        public int idDato { get; set; }
        public int idFuente { get; set; }
        public string Dato { get; set; }
        public bool Encontrado { get; set; }
        public Telefono[] Teléfonos { get; set; } = Array.Empty<Telefono>();
        public string Persona { get; set; }
        public string Puesto { get; set; }
        public string Lugar { get; set; }
        public string Link { get; set; }
        public int? validador { get; set; }
        public DateTime Fecha_Insert { get; set; } // Propiedad para Fecha_Insert
        public TimeSpan Segundo_Insert { get; set; } // Propiedad para Segundo_Insert
    }

    public class Telefono
    {
        public string NúmeroTelefónico { get; set; }
    }
}
