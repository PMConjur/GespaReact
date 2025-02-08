using System;
using System.Collections.Generic;

namespace NoriAPI.Models.Login
{

    public partial class EjecutivoInfoLogin
    {
        public int idEjecutivo { get; set; }

        /// <summary>
        /// Persona inmediata superior en jerarquía laboral.
        /// </summary>
        public int idEncargado { get; set; }
        public string Usuario { get; set; } = null!;
        public short? idCartera { get; set; }
        public short? idProducto { get; set; }
        public string Encargado { get; set; } = null!;
        public string NombreEjecutivo { get; set; } = null!;
        public short? idSucursal { get; set; }
        public short? idÁrea { get; set; }
        public byte? Jerarquía { get; set; }
        public int? Extensión { get; set; }
        public int? Dias {  get; set; }

    }
}