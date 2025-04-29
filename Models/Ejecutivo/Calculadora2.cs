using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class Calculadora2
    {
        public int idHerramienta {  get; set; }
        public string noCuenta { get; set; }
        public int idCartera { get; set; }
        public double montoRequerido { get; set; }
        public int descuento { get; set; }
        public int iMeses {  get; set; }
        public string fechaPago { get; set; }
        public int periodos { get; set; }
        public int modificar {  get; set; }
        public double montoModificar { get; set; }
        public string fechaPagoModificar { get; set; }
        public int pagoInicial { get; set; }
        public int filaModificar { get; set; }
        public Plazos[] plazos {  get; set; } 
    }
    public class Plazos
    {
        public int No { get; set; }
        public DateTime Fecha { get; set; }
        public double Saldo { get; set; }
        public double Pago { get; set; }
        public double SaldoFinal { get; set; }
    }

}
