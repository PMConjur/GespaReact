namespace NoriAPI.Models.Login
{
    public class ResultadoReseteo
    {
        public ResultadoReseteo(string? mensaje)
        {
            Mensaje = mensaje;            
        }

    public string? Mensaje { get; set; }

    }
}
