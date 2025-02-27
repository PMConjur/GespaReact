using System;

namespace NoriAPI.Models.Phones
{
    public class NewPhoneRequest
    {
        public string PhoneNumber { get; set; }
        public string Telefonia { get; set; }
        public string ClaseTelefono { get; set; }
        public TimeSpan HorarioContacto { get; set; }
        public int Extension { get; set; }
    }
}
