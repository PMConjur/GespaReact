using System;

namespace NoriAPI.Models.Phones
{
    public class NewPhone
    {

        /// <summary>
        /// Constructor para definir un nuevo teléfono.
        /// </summary>
        /// <param name="numeroTelefonico">Número telefónico.</param>
        /// <param name="idOrigen">Id del orígen del teléfono.</param>
        /// <param name="idClase">Id de la clase de teléfono.</param>
        /// <param name=horarioContacto">Horario de contacto del teléfon.</param>
        public NewPhone(string numeroTelefonico, int idTelefonía, int idOrigen, int idClase, TimeSpan horarioContacto, string estado, int extension)
        {

            NumeroTelefonico = numeroTelefonico;
            IdTelefonía = idTelefonía;
            IdClase = idClase;
            IdOrigen = idOrigen;
            HorarioContacto = horarioContacto;
            Estado = estado;
            Extension = extension;
        }

        public string NumeroTelefonico { get; set; }
        public int IdTelefonía { get; set; }
        public int IdClase { get; set; }
        public int IdOrigen { get; set; }
        public TimeSpan HorarioContacto { get; set; }
        public string Estado { get; set; }
        public int Extension { get; set; }

        /// <summary>
        /// Valida y limpia el número telefónico, regresa el mensaje de error.
        /// </summary>
        /// <param name="_NúmeroTelefónico">Número telefónico que se validará.</param>
        /// <param name="Resultado">Mensaje de error o teléfono correcto.</param>
        /// <returns>Si fue correcto o no.</returns>
        public bool ValidacionNumeroTelefonico(out string Resultado)
        {

            string sTel = NumeroTelefonico.Trim().Replace("-", "").Replace("-", "").Replace("+", "").Replace("(", "").Replace(")", "").Replace(" ", "");

            if (sTel.Length == 0)
            {
                Resultado = "";
                return false;
            }

            if (sTel.Length < 10)
            {
                Resultado = "Teléfono (" + sTel + ") demasiado corto, incluya la clave lada.";
                return false;
            }


            if (sTel.Length == 10 && (sTel.StartsWith('1') || sTel.StartsWith('0')))
            {
                Resultado = "El número telefónico (" + sTel + ") no puede comenzar con 0 o con 1.";
                return false;
            }


            int iIguales = 0, iConsecutivos = 0;
            for (int iCaracter = 0; iCaracter < sTel.Length; iCaracter++)
            {
                if (!char.IsNumber(sTel[iCaracter]))
                {
                    Resultado = "El número telefónico (" + sTel + ") contiene caracteres inválidos.";
                    return false;
                }
                if (iCaracter > 0)
                    if (sTel[iCaracter] == sTel[iCaracter - 1])
                        iIguales++;
                    else if (sTel[iCaracter] - 1 == sTel[iCaracter - 1])
                        iConsecutivos++;
                    else if (sTel[iCaracter] + 1 == sTel[iCaracter - 1])
                        iConsecutivos++;
            }

            if (iIguales >= 7)
            {
                Resultado = "El teléfono (" + sTel + ") contiene muchos números repetidos.";
                return false;
            }

            if (iConsecutivos >= 8)
            {
                Resultado = "El teléfono (" + sTel + ") contiene muchos números consecutivos.";
                return false;
            }


            Resultado = "";
            NumeroTelefonico = sTel;
            return true;
        }
    }
}
