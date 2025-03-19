using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class GestionTelefonicaRe
    {

        public GestionTelefonicaRe(int idCartera,string idCuenta,DateTime fechaInsert,TimeSpan segundoInsert,int idEjecutivo,string numeroTelefonico,short idContacto,short? idSituacion, short idSucursal, short? extension, short idModo, short? idAcercamiento, TimeSpan duracion, TimeSpan tiempoEnCuenta, short? idParentesco, string? nombreContacto, short? idCausaNoPago, string? comentario, int? idValidador)
        {
            IdCartera = idCartera;
            IdCuenta = idCuenta;
            FechaInsert = fechaInsert;
            SegundoInsert = segundoInsert;
            IdEjecutivo = idEjecutivo;
            NumeroTelefonico = numeroTelefonico;
            IdContacto = idContacto;
            IdSituacion = idSituacion;
            IdSucursal = idSucursal;
            Extension = extension;
            IdModo = idModo;
            IdAcercamiento = idAcercamiento;
            Duracion = duracion;
            TiempoEnCuenta = tiempoEnCuenta;
            IdParentesco = idParentesco;
            NombreContacto = nombreContacto;
            IdCausaNoPago = idCausaNoPago;
            Comentario = comentario;
            IdValidador = idValidador;

        }
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; } // Cambiado a string para coincidir con VARCHAR(16)
        public DateTime FechaInsert { get; set; } // Cambiado a DateTime
        public TimeSpan SegundoInsert { get; set; } // Cambiado a TimeSpan
        public int IdEjecutivo { get; set; }
        public string NumeroTelefonico { get; set; }
        public short IdContacto { get; set; } // Cambiado a short para coincidir con SMALLINT
        public short? IdSituacion { get; set; } // Cambiado a short?
        public short IdSucursal { get; set; } // Cambiado a short
        public short? Extension { get; set; } // Cambiado a short?
        public short IdModo { get; set; } // Cambiado a short
        public short? IdAcercamiento { get; set; } // Cambiado a short?
        public TimeSpan Duracion { get; set; }
        public TimeSpan TiempoEnCuenta { get; set; }
        public short? IdParentesco { get; set; } // Cambiado a short?
        public string? NombreContacto { get; set; }
        public short? IdCausaNoPago { get; set; } // Cambiado a short?
        public string? Comentario { get; set; }
        public int? IdValidador { get; set; } // Añadido IdValidador
    }
}
