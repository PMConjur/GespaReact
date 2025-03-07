using System.Net.NetworkInformation;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class CargoEnLinea
    {
        public decimal Monto { get; set; }
        public long Tarjeta { get; set; }
        public string Autorización { get; set; }
        // Eliminar la siguiente línea:
        // public string NoAutorización { get; set; }
        public int Status { get; set; }
        public int idBanco { get; set; }
        public int IdEjecutivoAutorizo { get; set; }
        public DateTime Vencimiento { get; set; }
        public string Nombre { get; set; }
        public bool EsClabe { get; set; }
        public bool Domiciliado { get; set; }
        public bool Sistema { get; set; }
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }

        public CargoEnLinea(decimal monto, long tarjeta, string autorizacion, /* Eliminar noAutorizacion de aqui */ int status, int IdBanco, int idEjecutivoAutorizo, DateTime vencimiento, string nombre, bool esClabe, bool domiciliado, bool sistema, int idCartera, string idCuenta, int idEjecutivo)
        {
            Monto = monto;
            Tarjeta = tarjeta;
            Autorización = autorizacion;
            // Eliminar la siguiente línea:
            // NoAutorización = noAutorizacion;
            Status = status;
            idBanco = IdBanco;
            IdEjecutivoAutorizo = idEjecutivoAutorizo;
            Vencimiento = vencimiento;
            Nombre = nombre;
            EsClabe = esClabe;
            Domiciliado = domiciliado;
            Sistema = sistema;
            IdCartera = idCartera;
            IdCuenta = idCuenta;
            IdEjecutivo = idEjecutivo;
        }
    }
}
