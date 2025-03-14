using System;

namespace NoriAPI.Models.Domicilios
{
    public class DomicilioTranslated
    {   public int? IdCartera { get; set; }
        public string? IdCuenta { get; set; }
        public int? IdDomicilio { get; set; }
        public string? Domicilio { get; set; }
        public DateTime? Fecha_Insert { get; set; }
        public int? IdEjecutivo { get; set; }
        public int? IdInformación { get; set; }
        public string? Información { get; set; }
        public string? Calle { get; set; }
        public string? NúmeroExterior { get; set; }
        public string? NúmeroInterior { get; set; }
        public int? IdCódigoPostal { get; set; }
        public string? CódigoPostal { get; set; }
        public string? ColoniaLocalidad { get; set; }
        public string? DelegaciónMunicipio { get; set; }
        public string? Estado { get; set; }
        public DateTime? FechaHora_Información { get; set; }
        public int? IdLogProceso { get; set; }
        public int? IdClase { get; set; }
        public string? Clase { get; set; }
        public int? IdOrígen { get; set; }
        public string? Orígen { get; set; }
    }
}
