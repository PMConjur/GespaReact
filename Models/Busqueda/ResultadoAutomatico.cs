using System.Collections.Generic;

namespace NoriAPI.Models.Busqueda
{
    public class ResultadoAutomatico
    {
        public string Mensaje {  get; set; }        
        public AutomaticoInfo Cuenta { get; set; }

        public ResultadoAutomatico(string mensaje, AutomaticoInfo infoCuenta) 
        {
            Mensaje = mensaje;
            Cuenta = infoCuenta;        
        }
    }
}
