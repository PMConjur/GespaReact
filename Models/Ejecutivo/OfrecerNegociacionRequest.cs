using System.Collections.Generic;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class OfrecerNegociacionRequest
    {
        public Pago_[] Plazos { get; set; }
        public double MontoNegociado { get; set; }
        public double MontoRequerido { get; set; }
        public double saldo { get; set; }
        public double descuento { get; set; }
        public int maxDescuento { get; set; }
        public int idHerramienta { get; set; }
        public string idCuenta { get; set; }
        public int idCartera { get; set; }


    }

}