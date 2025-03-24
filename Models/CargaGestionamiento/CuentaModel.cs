using System;

namespace NoriAPI.Models.CargaGestionamiento
{
    public class CuentaModel
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdProducto { get; set; }
        public bool CuentaActiva { get; set; }
        public string Expediente { get; set; }
        public int IdSituacion { get; set; }
        public string NombreDeudor { get; set; }
        public string Rfc { get; set; }
        public string NumeroCliente { get; set; }
        public decimal Saldo { get; set; }
        public DateTime FechaCambioActivacion { get; set; }
        public int IdSituacionDesactivacion { get; set; }
        public DateTime FechaUpdate { get; set; }
        public int IdSucursal { get; set; }
        public DateTime FechaUltimaGestion { get; set; }
        public int IdEjecutivoUltimaGestion { get; set; }
        public DateTime FechaUltimaVisita { get; set; }
        public int IdEjecutivoUltimaVisita { get; set; }
        public DateTime FechaUltimaNegociacion { get; set; }
        public int IdEjecutivoUltimaNegociacion { get; set; }
        public DateTime FechaUltimoPago { get; set; }
        public DateTime FechaProximoSeguimiento { get; set; }
        public int IdCausaNoPago { get; set; }
        public decimal MontoUltimoPago { get; set; }
        public int PagosVencidos { get; set; }
        public bool Bloqueo { get; set; }
    }

    // Puedes usar CuentaModel para DrInfo o crear un modelo más específico si solo necesitas algunas propiedades
    public class DrInfo
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        // Agrega más propiedades según tus necesidades
    }
}
