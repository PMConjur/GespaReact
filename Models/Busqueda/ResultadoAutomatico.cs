using System.Collections.Generic;

namespace NoriAPI.Models.Busqueda
{
    public class ResultadoAutomatico
    {
        public string Mensaje {  get; set; }
        
        public List<AutomaticoInfo> ListaCuentas { get; set; }

        public ResultadoAutomatico(string mensaje, List<AutomaticoInfo> listaCuentas) 
        {
            Mensaje = mensaje;
            ListaCuentas = listaCuentas;        
        }
    }
}
