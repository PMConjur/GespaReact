using NoriAPI.Models;

namespace NoriAPI.Models.Login
{
    public class ResultadoLogin
    {
        public ResultadoLogin(string? mensaje, bool? sesion, bool? expiro, EjecutivoInfoLogin? infoEjecutivo, string? token)
        {
            Mensaje = mensaje;
            Sesion = sesion;
            Expiro = expiro;
            InfoEjecutivo = infoEjecutivo;
            Token = token;
        }

        public string? Mensaje { get; set; }
        public bool? Sesion { get; set; }
        public bool? Expiro { get; set; }
        public string? Token { get; set; }
        public EjecutivoInfoLogin? InfoEjecutivo { get; set; }
    }
}
