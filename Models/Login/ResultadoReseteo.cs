namespace NoriAPI.Models.Login
{
    public class ResultadoReseteo
    {
        public ResultadoReseteo(string? mensaje, string? exito)
        {
            Mensaje = mensaje;
            Exito = exito;
        }

        public string? Mensaje { get; set; }
        public string? Exito { get; set; }

    }
}