namespace NoriAPI.Models.Domicilios
{
    public class NewAddress
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public int? IdCódigoPostal { get; set; }
        public string? Colonia { get; set; }
        public int? IdClase { get; set; }
        public string? Municipio { get; set; }
        public string? Estado { get; set; }

    }
}
