using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class CargoEnLineaRequest
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public long Tarjeta { get; set; }
        public string Nombre { get; set; }
        public DateTime Vencimiento { get; set; }
        public decimal Monto { get; set; }
        public short? IdBanco { get; set; }
        public bool EsClabe { get; set; }
        public bool Domiciliado { get; set; }
        public string Autorizacion { get; set; }
        public int? IdEjecutivoAutorizo { get; set; }
        public bool Sistema { get; set; }
        public byte Status { get; set; }

        public CargoEnLineaRequest() { } // constructor sin parámetros

        public CargoEnLineaRequest(int idCartera, string idCuenta, int idEjecutivo, long tarjeta, string nombre, DateTime vencimiento, decimal monto, short? idBanco, bool esClabe, bool domiciliado, string autorizacion, int? idEjecutivoAutorizo, bool sistema, byte status)
        {
            IdCartera = idCartera;
            IdCuenta = idCuenta;
            IdEjecutivo = idEjecutivo;
            Tarjeta = tarjeta;
            Nombre = nombre;
            Vencimiento = vencimiento;
            Monto = monto;
            IdBanco = idBanco;
            EsClabe = esClabe;
            Domiciliado = domiciliado;
            Autorizacion = autorizacion;
            IdEjecutivoAutorizo = idEjecutivoAutorizo;
            Sistema = sistema;
            Status = status;
        }
    }
}
