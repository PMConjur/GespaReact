using System;

namespace NoriAPI.Models.Phones
{
    public class NewPhoneRequest
    {
        public string Cuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public string PhoneNumber { get; set; }
        public string Telefonia { get; set; }
        public string ClaseTelefono { get; set; }
        public TimeSpan HorarioContacto { get; set; }
        public int Extension { get; set; }
    }
}
