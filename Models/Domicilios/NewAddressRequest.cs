namespace NoriAPI.Models.Domicilios
{
    public class NewAddressRequest
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public int IdProducto { get; set; }
        public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string IdCodigoPostal { get; set; }
        public string Colonia { get; set; }
        public string Municipio { get; set; }
        public string Estado { get; set; }
        public int IdClase { get; set; }
    }
}