namespace NoriAPI.Models.Busqueda
{
    public class BusquedaClass
    {
        public int idDato { get; set; }
        public string Dato { get; set; }
        public int idFuente { get; set; }
        public bool Encontrado { get; set; }
        public Telefono[] Teléfonos { get; set; }
        public string Persona { get; set; }
        public string Puesto { get; set; }
        public string Lugar { get; set; }
        public string Link { get; set; }
        public string? validador { get; set; }

    }
    public class Telefono
    {
        public string NúmeroTelefónico { get; set; }
    }
}
