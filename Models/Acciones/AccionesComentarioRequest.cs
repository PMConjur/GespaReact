namespace NoriAPI.Models.Acciones
{
    public class AccionesComentarioRequest
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public string Comentario { get; set; }
        public bool ModificaSituacion { get; set; }
    }
}
