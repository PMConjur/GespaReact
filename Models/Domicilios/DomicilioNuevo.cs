namespace NoriAPI.Models.Domicilios
{
    public class DomicilioNuevo
    {
        public string Calle { get; set; }
        public string NumeroInterior { get; set; }
        public string NumeroExterior { get; set; }
        public string Colonia { get; set; }
        public string Municipio { get; set; }
        public string Estado { get; set; }
        public int IdCodigoPostal { get; set; }
        public int IdClase { get; set; }
    }
}
