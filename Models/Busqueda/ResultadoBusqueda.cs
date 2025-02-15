using System.Collections.Generic;

namespace NoriAPI.Models.Busqueda
{
    public class ResultadoBusqueda
    {
        public string Mensaje { get; set; }
        public List<BusquedaInfo> ListaResultados { get; set; }  // 🔹 Cambiar a lista

        public ResultadoBusqueda(string mensaje, List<BusquedaInfo> listaResultados)
        {
            Mensaje = mensaje;
            ListaResultados = listaResultados;
        }
    }
}