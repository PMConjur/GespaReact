using System.Collections.Generic;

namespace NoriAPI.Models.Domicilios
{
    public class DomiciliosVisitasResult
    {
        public List<Domicilio> Domicilios { get; set; }
        public List<GestionDomiciliaria> Visitas { get; set; }
        public string Error { get; set; }
    }
}
