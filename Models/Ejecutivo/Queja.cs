using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class Queja
    {
        public int idCartera { get; set; }
        public string idCuenta { get; set; }
        public DateTime Fecha_Insert { get; set; }
        public TimeSpan Segundo_Insert { get; set; }
        public string Folio { get; set; }
        public int idEjecutivo_Insert { get; set; }
        public int idQueja { get; set; }
        public int idInstitución { get; set; }
        public string Solicitante { get; set; }
        public bool LlamadaEntrada { get; set; }
        public long NúmeroTelefónico { get; set; }
        public string CorreoElectrónico { get; set; }
        public int idDomicilio { get; set; }
        public string Comentario { get; set; }
        public int idEjecutivo_Queja { get; set; }
        public string NúmeroTelefónico_Contacto { get; set; }
        public string CorreoElectrónico_Contacto { get; set; }

        public Queja() { } // Constructor vacío

        public Queja(int idCartera, string idCuenta, DateTime fechaInsert, TimeSpan segundoInsert, string folio, int idEjecutivoInsert, int idQueja, int idInstitución, string solicitante, bool llamadaEntrada, long númeroTelefónico, string correoElectrónico, int idDomicilio, string comentario, int idEjecutivoQueja, string númeroTelefónicoContacto, string correoElectrónicoContacto)
        {
            this.idCartera = idCartera;
            this.idCuenta = idCuenta;
            Fecha_Insert = fechaInsert;
            Segundo_Insert = segundoInsert;
            Folio = folio;
            idEjecutivo_Insert = idEjecutivoInsert;
            this.idQueja = idQueja;
            this.idInstitución = idInstitución;
            Solicitante = solicitante;
            LlamadaEntrada = llamadaEntrada;
            NúmeroTelefónico = númeroTelefónico;
            CorreoElectrónico = correoElectrónico;
            this.idDomicilio = idDomicilio;
            Comentario = comentario;
            idEjecutivo_Queja = idEjecutivoQueja;
            NúmeroTelefónico_Contacto = númeroTelefónicoContacto;
            CorreoElectrónico_Contacto = correoElectrónicoContacto;
        }
    }
}
