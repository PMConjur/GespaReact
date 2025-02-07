using System;
using System.Collections.Generic;

namespace NoriAPI.Models
{

    public partial class Ejecutivos
    {
        public int idEjecutivo { get; set; }

        /// <summary>
        /// Fecha que se insertó el EjecutivoLogin.
        /// </summary>
        public DateTime Fecha_Insert { get; set; }

        public short idÁrea { get; set; }

        public short? idSucursal { get; set; }

        public short? idCartera { get; set; }

        public short? idProducto { get; set; }

        /// <summary>
        /// Persona inmediata superior en jerarquía laboral.
        /// </summary>
        public int idEncargado { get; set; }

        public string NombreEjecutivo { get; set; } = null!;

        public string Usuario { get; set; } = null!;

        public byte[] Contraseña { get; set; }

        public DateTime? Fecha_Update { get; set; }

        public bool Bloqueado { get; set; }

        /// <summary>
        /// Nivel de jerarquía del ejecutivo, 0 es la más baja. Se utiliza para permisos.
        /// </summary>
        public byte Jerarquía { get; set; }

        public bool Telefónico { get; set; }

        public bool Domiciliario { get; set; }

        public byte[] Contraseña2 { get; set; }

        public byte[] Contraseña3 { get; set; }

        public short? idBaja { get; set; }

        public short? idPuesto { get; set; }

        public DateTime? FechaBaja { get; set; }




    }
}