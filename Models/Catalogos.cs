using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System;

namespace NoriAPI.Models
{
    public class Catalogos
    {
        // Catálogos
        public Dictionary<int, Producto> Productos { get; } = new Dictionary<int, Producto>();
        public Dictionary<int, Cartera> Carteras { get; } = new Dictionary<int, Cartera>();
        public Dictionary<int, FlujoPregunta> PreguntasFlujo { get; } = new Dictionary<int, FlujoPregunta>();
        public Dictionary<int, int> CarteraProductos { get; } = new Dictionary<int, int>();
        public HashSet<string> IdsInformacionValidos { get; } = new HashSet<string>(); // Reemplazado NombresId
        public Dictionary<string, string> PalabrasProhibidas { get; } = new Dictionary<string, string>();
        public List<int> EstadosContingencia { get; } = new List<int>();

        // Tablas de datos
        public DataTable RespuestasFlujo { get; set; }
        public DataTable Scripts { get; set; }
        public DataTable Herramientas { get; set; }
        public DataTable ServidoresViciDial { get; set; }
        public DataTable Versionamiento { get; set; }

        // Configuraciones
        public int MargenMinsSeguimiento { get; set; } = 5;
        public bool Formato24H { get; set; } = false;
        public string FormatoHora { get; set; } = "hh:mm tt";
        public string SituacionesDefinicion { get; set; } = "";

        // Variables de tiempo
        private DateTime _fechaHoraComienzo;
        private Stopwatch _swTiempoTranscurrido;

        // Propiedades de tiempo
        public DateTime Hoy => _fechaHoraComienzo.Date;
        public DateTime Ahora => _fechaHoraComienzo.Add(_swTiempoTranscurrido.Elapsed);

        // Constructor
        public Catalogos()
        {
            _fechaHoraComienzo = DateTime.Now;
            _swTiempoTranscurrido = Stopwatch.StartNew();

            // Inicializar los idInformacion válidos
            IdsInformacionValidos.Add("1901");
            IdsInformacionValidos.Add("1902");
            // Agrega otros idInformacion válidos según sea necesario
        }

        // Métodos para cargar datos desde la base de datos o desde un archivo
        public void CargarProductos(DataTable datos)
        {
            foreach (DataRow fila in datos.Rows)
            {
                Productos.Add(Convert.ToInt32(fila["Id"]), new Producto
                {
                    Id = Convert.ToInt32(fila["Id"]),
                    Nombre = fila["Nombre"].ToString()
                });
            }
        }

        // Agrega métodos para cargar otros catálogos y tablas de datos
    }

    // Modelos auxiliares
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        // Agrega otras propiedades según sea necesario
    }

    public class Cartera
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Abreviacion { get; set; }
        public bool ComplementoActivo { get; set; }
        // Agrega otras propiedades según sea necesario
    }

    public class FlujoPregunta
    {
        public int Id { get; set; }
        public string Pregunta { get; set; }
        // Agrega otras propiedades según sea necesario
    }
}
