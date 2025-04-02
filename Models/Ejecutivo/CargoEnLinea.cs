using System.Net.NetworkInformation;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class CargoEnLinea
    {
        public int idCartera { get; set; }
        public string idCuenta { get; set; }
        public int idEjecutivo { get; set; }
        public long Tarjeta { get; set; }
        public string Nombre { get; set; }
        public DateTime Vencimiento { get; set; }
        public decimal Monto { get; set; }
        public short? idBanco { get; set; }
        public bool EsClabe { get; set; }
        public bool Domiciliado { get; set; }
        public string Autorizacion { get; set; }
        public int? idEjecutivo_Autorizo { get; set; }
        public bool Sistema { get; set; }
        public byte Status { get; set; }
        public CargoEnLinea() { }

        public CargoEnLinea(decimal monto, long tarjeta, string autorizacion, byte status, short? idBanco, int? idEjecutivoAutorizo, DateTime vencimiento, string nombre, bool esClabe, bool domiciliado, bool sistema, int idCartera, string idCuenta, int idEjecutivo)
        {
            Monto = monto;
            Tarjeta = tarjeta;
            Autorizacion = autorizacion;
            Status = status;
            this.idBanco = idBanco;
            idEjecutivo_Autorizo = idEjecutivoAutorizo;
            Vencimiento = vencimiento;
            Nombre = nombre;
            EsClabe = esClabe;
            Domiciliado = domiciliado;
            Sistema = sistema;
            this.idCartera = idCartera;
            this.idCuenta = idCuenta;
            this.idEjecutivo = idEjecutivo;
        }
    }
}
