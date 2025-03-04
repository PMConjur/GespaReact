using System;

namespace NoriAPI.Models.Phones
{
    public class Phone
    {
        public string Titulares { get; set; }
        public string Conocidos { get; set; }
        public string Desconocidos { get; set; }
        public string SinContacto { get; set; }
        public string IntentosViciDial { get; set; }
        public int ID { get; set; }
        public string NúmeroTelefónico { get; set; }
        public int idTelefonía { get; set; }
        public int idOrigen { get; set; }
        public int idClase { get; set; }
        public string Estado { get; set; }
        public string Municipio { get; set; }
        public string HusoHorario { get; set; }
        public TimeSpan? SegHorarioContacto { get; set; }
        public string Extensión { get; set; }
        public bool _Confirmado { get; set; }
        public DateTime Fecha_Insert { get; set; }
        public string Calificacion { get; set; }
        public bool Activo { get; set; }
    }
}
