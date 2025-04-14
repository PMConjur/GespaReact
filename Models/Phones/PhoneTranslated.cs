using System;

namespace NoriAPI.Models.Phones
{
    public class PhoneTranslated : Phone
    {
        public string? Telefonia { get; set; }
        public string? Origen { get; set; }
        public string? Clase { get; set; }
        public string? Confirmado { get; set; }
        public string? Activo { get; set; }
    }
}
