using System;

namespace NoriAPI.Models.Ofrecimiento
{
    public class SaveOfrecimientoGeneralRequest: SaveOfrecimientoRequest
    {
        public string HerramientaNombre { get; set; }
        public int PV { get; set; }
        public string Agente { get; set; }

    }
}
