using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NoriAPI.Models.Acciones
{
    public class Queja
    {  
        public short IdCartera { get; set; }

        public string IdCuenta { get; set; }

        public DateTime FechaInsert { get; set; }

        public TimeSpan SegundoInsert { get; set; }

        public string Folio { get; set; }

        public int IdEjecutivoInsert { get; set; }

        public short IdQueja { get; set; }

        public short IdInstitucion { get; set; }

        public string Solicitante { get; set; }

        public bool LlamadaEntrada { get; set; }

        public long? NumeroTelefonico { get; set; }

        public string CorreoElectronico { get; set; }

        public int? IdDomicilio { get; set; }

        public string Comentario { get; set; }

        //public int? IdEjecutivoQueja { get; set; }

        public long? NumeroTelefonicoContacto { get; set; }

        public string CorreoElectronicoContacto { get; set; }

    }
}

