namespace NoriAPI.Models.Domicilios
{
    public class UpdateAddressInfoRequest
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdDomicilio { get; set; }
        public int IdInformacion { get; set; }
    }
}
