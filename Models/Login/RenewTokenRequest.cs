namespace NoriAPI.Models.Login
{
    public class RenewTokenRequest
    {
        public int? IdEjecutivo { get; set; }
        public string? Usuario { get; set; }
        public string? Password { get; set; }
    }
}
