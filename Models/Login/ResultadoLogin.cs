using NoriAPI.Models;

namespace NoriAPI.Models.Login
{
    public class ResultadoLogin
    {
        public ResultadoLogin(string? mensaje, bool? sesion, bool? expiro, EjecutivoInfoLogin? infoEjecutivo)
        {
            Mensaje = mensaje;
            Sesion = sesion;
            Expiro = expiro;
            InfoEjecutivo = infoEjecutivo;
        }

        public string? Mensaje { get; set; }
        public bool? Sesion { get; set; }
        public bool? Expiro { get; set; }
        public EjecutivoInfoLogin? InfoEjecutivo { get; set; }
    }
}
