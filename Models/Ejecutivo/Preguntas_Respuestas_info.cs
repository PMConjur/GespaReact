namespace NoriAPI.Models.Ejecutivo
{
    public class Preguntas_Respuestas_info
    {
        public int IdPregunta { get; set; }
        public string Pregunta { get; set; }
        public int IdRespuesta { get; set; }
        public int IdValor { get; set; }
        public string Respuesta { get; set; }
        public int IdSiguientePregunta { get; set; }
        public int Seguimiento { get; set; }
        public int Negociacion { get; set; }
        public int Identificador { get; set; }
        public string Valor { get; set; }
        public int ValorActivo { get; set; }

    }
}
