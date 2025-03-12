namespace NoriAPI.Models.Ejecutivo
{
    public class Correos
    {
        public string CorreoElectronico { get; set; }
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public int IdOrigen { get; set; }
        public int IdInformacion { get; set; }

        // Constructor que permite inicializar todas las propiedades
        public Correos(string correoElectronico, int idCartera, string idCuenta, int idEjecutivo, int idOrigen, int idInformacion)
        {
            CorreoElectronico = correoElectronico;
            IdCartera = idCartera;
            IdCuenta = idCuenta;
            IdEjecutivo = idEjecutivo;
            IdOrigen = idOrigen;
            IdInformacion = idInformacion;
        }

        // Constructor vacío (opcional)
        public Correos() { }
    }
}
