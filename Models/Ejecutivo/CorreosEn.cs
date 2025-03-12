namespace NoriAPI.Models.Ejecutivo
{
    public class CorreosEn
    {
        public string CorreoElectronico { get; set; }
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public int IdOrigen { get; set; }
        public int IdInformacion { get; set; }
        public string Mensaje { get; set; }
        public string Asunto { get; set; }
        public short IdEtapa { get; set; }

        // Constructor que permite inicializar todas las propiedades
        public CorreosEn(string correoElectronico, int idCartera, string idCuenta, int idEjecutivo, int idOrigen, int idInformacion, string mensaje, string asunto, short idEtapa)
        {
            CorreoElectronico = correoElectronico;
            IdCartera = idCartera;
            IdCuenta = idCuenta;
            IdEjecutivo = idEjecutivo;
            IdOrigen = idOrigen;
            IdInformacion = idInformacion;
            Mensaje = mensaje;
            Asunto = asunto;
            IdEtapa = idEtapa;
        }

        // Constructor vacío (opcional)
        public CorreosEn() { }
    }
}
