using NoriAPI.Models;

namespace NoriAPI.Models.Login
{
    public class EjecutivoLogin
    {
        public EjecutivoLogin(string? mensaje, bool? expiro, Ejecutivos? infoEjecutivo)
        {
            Mensaje = mensaje;
            Expiro = expiro;
            InfoEjecutivo = infoEjecutivo;
        }

        public string? Mensaje { get; set; }
        public bool? Expiro { get; set; }
        public Ejecutivos? InfoEjecutivo { get; set; }
    }
}
