using System;

namespace NoriAPI.Models.CargaGestionamiento
{
    public class CatalogoModel
    {
        public int IdCatalogo { get; set; }
        public string Catalogo { get; set; }
        public string NombreId { get; set; }
        public string DescripcionCatalogo { get; set; }
        public DateTime FechaCatalogo { get; set; }
    }
}
