namespace NoriAPI.Models.Ejecutivo
{
    public class TiemposEjecutivo
    {
        public TiemposEjecutivo(string? mensaje, ResultadoTiempos? resultadoTiempos)
        {
            Mensaje = mensaje;
            ResultadosTiempos = resultadoTiempos;
        }

        public string? Mensaje { get; set; }
        public ResultadoTiempos? ResultadosTiempos { get; set; }  // 🔹 

    }
}
