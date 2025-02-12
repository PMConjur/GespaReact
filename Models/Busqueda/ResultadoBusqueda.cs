namespace NoriAPI.Models.Busqueda
{
    public class ResultadoBusqueda
    {
        public ResultadoBusqueda(string mensaje, BusquedaInfo busquedainfo)
        {
            Mensaje = mensaje;
            Busquedainfo = busquedainfo;
        }

        public string Mensaje { get; set; }        
        public BusquedaInfo Busquedainfo { get; set; }
    }
}
