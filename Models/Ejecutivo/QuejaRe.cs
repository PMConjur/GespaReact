using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class QuejaRe
    {
        public int idCartera { get; set; }
        public string idCuenta { get; set; }
        public DateTime Fecha_Insert { get; set; }
        public TimeSpan Segundo_Insert { get; set; }
        public string Folio { get; set; }
        public int idEjecutivo_Insert { get; set; }
        public int idQueja { get; set; }
        public int idInstitución { get; set; }
        public int idValor { get; set; }
        public string Solicitante { get; set; }
        public bool LlamadaEntrada { get; set; }
        public long NúmeroTelefónico { get; set; }
        public string CorreoElectrónico { get; set; }
        public int idDomicilio { get; set; }
        public string Comentario { get; set; }
        public int idEjecutivo_Queja { get; set; }
        public string NúmeroTelefónico_Contacto { get; set; }
        public string CorreoElectrónico_Contacto { get; set; }

    }
}
