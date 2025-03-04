﻿namespace NoriAPI.Models.Busqueda
{
    public class ResultadoProductividad
    {
        public ResultadoProductividad(string mensaje, ProductividadInfo infoProductividad)
        {
            Mensaje = mensaje;
            ProductividadInfo = infoProductividad;
        }

        public string Mensaje { get; set; }
        public ProductividadInfo ProductividadInfo { get; set; }


    }
}