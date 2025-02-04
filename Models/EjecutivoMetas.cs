using System;
using System.Collections.Generic;

namespace NoriAPI.Models
{
    public partial class EjecutivoMetas
    {
        public string Tipo_Personal { get; set; }

        public int idEjecutivo_insert { get; set; }

        public DateTime Fecha_insert { get; set; }

        public TimeSpan Hora_insert { get; set; }

        public DateTime Fecha_Meta { get; set; }

        public int No_Empleado { get; set; }

        public string Login { get; set; } = null!;

        public string Status { get; set; }

        public string Nombre_Del_Personal { get; set; } = null!;

        public long Num_Telefonico_Celular { get; set; }

        public string Puesto { get; set; } = null!;

        public DateTime Fecha_De_Ingreso_A_La_Cartera { get; set; }

        public string Cartera { get; set; } = null!;

        public string Segmento_Producto { get; set; } = null!;

        public string Direccion { get; set; } = null!;

        public string SubDirector { get; set; }

        public string Gerente { get; set; } = null!;

        public string Coordinador { get; set; } = null!;

        public string Supervisor { get; set; } = null!;

        public string Turno { get; set; } = null!;

        public string Horario { get; set; } = null!;

        public string Sucursal { get; set; } = null!;

        public string Comentarios { get; set; }

        public string Sucursal_ { get; set; } = null!;

        public float Calidad { get; set; }

        public string Promesas { get; set; } = null!;

        public double Cumplimiento { get; set; }

        public decimal Semana_1_del_1_al_7 { get; set; }

        public decimal Semana_2_del_8_al_14 { get; set; }

        public decimal Semana_3_del_15_al_21 { get; set; }

        public decimal Semana_4_del_22_al_31 { get; set; }

        public decimal Meta_Total { get; set; }

        public string Promesas_por_dia { get; set; }

        public string Gestiones_por_dia { get; set; }
    }
}