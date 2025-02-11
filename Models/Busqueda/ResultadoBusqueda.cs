namespace NoriAPI.Models.Busqueda
{
    public class ResultadoBusqueda
    {

        public ResultadoBusqueda(string? mensaje)
        {
            Mensaje = mensaje;
        }

        public string Mensaje { get; set; }

    }
}
