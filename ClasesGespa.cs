using System.Collections;
using System.Data;
using System.Diagnostics;
using System;

namespace NoriAPI
{
    static class Catalogos
    {
        //static CuentaClass _Cuenta;
        /* Atributos */

        static DataSet _dsTablas = new DataSet();
        static DataTable _CamposPantalla;
        static DataTable _FlujoRespuestas;
        static DataTable _Scripts;
        static DataTable _Plantillas;
        static DataTable _Herramientas;
        static DataTable _Productos;
        static DataTable _ServidoresViciDial;

        static Hashtable _htValoresCatálogo;
        static Hashtable _htNombreId;
        static Hashtable _htCarteras;
        static Hashtable _htCarterasComplemento;
        static Hashtable _htCarterasAbreviación;
        static Hashtable _htProductos;
        static Hashtable _htCarteraProductos;
        static Hashtable _htFlujoPreguntas;
        static Hashtable _htLetrasRepetición;
        static Hashtable _htPalabras;

        static ArrayList _alNombreId;
        static ArrayList _alEstadosContingencia;

        static DateTime _FechaHoraComienzo;
        static Stopwatch _swTiempoTranscurrido;

        static int _MárgenMinsSeguimiento = 5;
        static bool _Formato24H = false;
        static string _FormatoHora = "hh:mm tt";
        static string _SituacionesDefinición = "";
        //UsuariosRH
        public static string ResultDialog;
        public static int Contador = 0;
        public static string Validador;

        /// <summary>
        /// Cuentas a las que se les realizó una gestión en el día. 
        /// </summary>
        public static DataTable Cuentas;
        /// <summary>
        /// Gestiones realizadas en el día por el ejecutivo.
        /// </summary>
        public static DataTable GestionesEjecutivo;

        public static Hashtable Relaciones(string Catálogo1, string Catálogo2, params string[] Valor2)
        {

            Hashtable htRelaciones = new Hashtable();

            string sSelectValor2 = "";
            string sValores = "''";
            foreach (string sValor in Valor2)
                sValores += ",'" + sValor + "'";
            if (Valor2.Length > 0)
                sSelectValor2 = " AND Valor2 IN (" + sValores + ") ";

            DataRow[] drFilas = _dsTablas.Tables["Relaciones"].Select("Catálogo1 = '" + Catálogo1 + "' AND Catálogo2 = '" + Catálogo2 + "' " + sSelectValor2);
            foreach (DataRow fila in drFilas)
                htRelaciones.Add(fila["idValor1"].ToString(), fila["idValor2"].ToString());


            return htRelaciones;
        }
      
    }
    class CuentaClass
    {
        static string[] _NombreColumnasConteos = { "Titulares", "Conocidos", "Desconocidos", "SinContacto" };
        public static string[] NombreColumnasConteos { get { return _NombreColumnasConteos; } }





    }



}
