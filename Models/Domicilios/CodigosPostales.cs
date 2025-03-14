using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NoriAPI.Models.Domicilios
{
    public class CodigosPostales
    {
        public int IdCódigoPostal { get; set; }
        public string CódigoPostal { get; set; }
        public string Colonia { get; set; }
        public string Municipio { get; set; }
        public string Estado { get; set; }
        public string Zona { get; set; }
        public string Asentamiento { get; set; }
        public string Periferia { get; set; }
        public string Estancia { get; set; }
        public string Sucursal { get; set; }
        public bool ZonaRiesgo { get; set; }
    }
}
