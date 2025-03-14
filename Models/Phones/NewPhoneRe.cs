using System;

namespace NoriAPI.Models.Phones
{
    public class NewPhoneRe
    {

        public string NumeroTelefonico { get; set; }
        public int IdTelefonía { get; set; }
        public int IdOrigen { get; set; }
        public int IdClase { get; set; }
        public TimeSpan HorarioContacto { get; set; }
        public string Estado { get; set; }
        public int Extension { get; set; }
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }

    }
}
