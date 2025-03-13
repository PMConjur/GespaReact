namespace NoriAPI.Models.Ejecutivo
{
    public class Adicional
    {
        public string Nombre { get; set; }
        public int IdParentesco { get; set; }
        public string NumeroTelefonico { get; set; }
        public string IdCuenta { get; set; }
        public int IdCartera { get; set; }
        public int IdEjecutivo { get; set; }

        // Constructor sin parámetros
        public Adicional() { }

        public Adicional(string nombre, int idParentesco, string numeroTeledonico, string idCuenta, int idCartera, int idEjecutivo)
        {
            Nombre = nombre;
            this.IdParentesco = idParentesco;
            NumeroTelefonico = numeroTeledonico;
            IdCuenta = idCuenta;
            IdCartera = idCartera;
            IdEjecutivo = idEjecutivo;
        }
    }
}
