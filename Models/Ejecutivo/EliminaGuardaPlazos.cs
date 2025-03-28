using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class EliminaGuardaPlazos
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdHerramienta { get; set; }
        public double MontoRequerido { get; set; }
        public double MontoNegociado { get; set; }
        public double Descuento { get; set; }
        public Pago_[] Plazos { get; set; }
        //-------------------------------------------------------------------//        
        public DateTime FechaInsert { get; set; }
        public string Segundo_Insert { get; set; }       
        public int CartaConvenio { get; set; }
        public string Correo { get; set; }
        public int IdEjecutivoValidador { get; set; }
                

    }
}
