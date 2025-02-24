namespace NoriAPI.Models.Busqueda
{
    public class ResultadoProductividad
    {

        public string Mensaje { get; set; }
        public ProductividadInfo ProductividadInfo { get; set; }

        public ResultadoProductividad(string mensaje, ProductividadInfo infoProductividad)
        {
            Mensaje = mensaje;
            ProductividadInfo = infoProductividad;
        }
<<<<<<< HEAD
        
=======
        public string Mensaje { get; set; }


>>>>>>> Mark-10-Tiempos
    }
}