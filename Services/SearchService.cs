using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using NoriAPI.Repositories;
using System;
using System.Threading.Tasks;
using NoriAPI.Models.Busqueda;
using System.Linq;
using System.Data;
using System.Text.RegularExpressions;
using NoriAPI.Models.Phones;
using Microsoft.IdentityModel.Tokens;
using NoriAPI.Models.Domicilios;
using NoriAPI.Models;
using System.Collections;
using System.Reflection;
using System.Numerics;


namespace NoriAPI.Services
{
    public interface ISearchService
    {
        Task<ResultadoBusqueda> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<ResultadoAutomatico> ValidateAutomatico(int numEmpleado);
        Task<List<PhoneTranslated>> FetchPhones(string idCuenta);
        Task<Dictionary<string, object>> CalculateProductData(string idCuenta);
        Task<bool> ValidatePhone(string telefono, string idCuenta);
        Task<string> SaveNewPhone(NewPhoneRequest newPhoneData);
        Task<string> SaveNewPhoneRe(NewPhoneRe newPhoneData);


        #region Domicilios
        Task<DomiciliosVisitasResult> DomiciliosVisitas(int idCartera, string idCuenta);
        Task<CatalogoDomicilios> RelacionesDomicilios();
        Task<List<CodigosPostales>> FindPostalCodeInfo(int codigoPostal);
        Task<(NewAddressResult, string, bool)> SaveNewAddress(NewAddressRequest newAddressData);
        Task<(string, bool)> UpdateAddressInfo(UpdateAddressInfoRequest domicilioInfoUpdate);
        Task<(string, bool)> UpdateAddressClass(UpdateAddressClassRequest domicilioClassUpdate);

        #endregion
        Task<dynamic> GetConversacionData(string idCuenta, string correo);

    }

    public class SearchService : ISearchService
    {

        private readonly IConfiguration _configuration;
        private readonly ISearchRepository _searchRepository;
        private readonly IEjecutivoRepository _ejecutivoRepository;

        public SearchService(IConfiguration configuration, ISearchRepository searchRepository, IEjecutivoRepository ejecutivoRepository)
        {
            _configuration = configuration;
            _searchRepository = searchRepository;
            _ejecutivoRepository = ejecutivoRepository;
        }

        public async Task<ResultadoBusqueda> ValidateBusqueda(string filtro, string ValorBusqueda)
        {
            string mensaje = null;
            List<BusquedaInfo> listaBusquedaInfo = new List<BusquedaInfo>();

            var validateBusqueda = await _searchRepository.ValidateBusqueda(filtro, ValorBusqueda);

            if (validateBusqueda == null)
            {
                mensaje = "No se encontró información";
                return new ResultadoBusqueda(mensaje, null);
            }

            // 🔹 Si Dapper devuelve una sola fila, lo convierte en un diccionario
            if (validateBusqueda is IDictionary<string, object> singleRow)
            {
                var busquedaInfo = MapToInfoBusqueda(singleRow);
                return new ResultadoBusqueda(mensaje, new List<BusquedaInfo> { busquedaInfo });
            }

            // 🔹 Si Dapper devuelve múltiples filas, las convertimos en una lista de diccionarios
            var listaDiccionarios = ((IEnumerable<dynamic>)validateBusqueda)
                .Select(item => (IDictionary<string, object>)item)
                .ToList();

            if (!listaDiccionarios.Any())
            {
                mensaje = "No se encontró información";
                return new ResultadoBusqueda(mensaje, new List<BusquedaInfo>());
            }

            // 🔹 Convertir a lista de `BusquedaInfo`
            listaBusquedaInfo = listaDiccionarios.Select(MapToInfoBusqueda).ToList();

            return new ResultadoBusqueda(mensaje, listaBusquedaInfo);

        }
        public async Task<ResultadoAutomatico> ValidateAutomatico(int numEmpleado)
        {
            string mensaje = null;
            var automaticoInfo = await _searchRepository.ValidateAutomatico(numEmpleado);
            var dict = (IDictionary<string, object>)automaticoInfo;

            if (dict == null)
            {
                mensaje = "Sin información.";
                return new ResultadoAutomatico(mensaje, null);
            }
            else
            {
                if (dict.TryGetValue("Mensaje", out object mensajeAuto) && mensajeAuto != null)//
                {
                    mensaje = mensajeAuto.ToString();
                    return new ResultadoAutomatico(mensaje, null);
                }
                else
                {
                    var automatico = MapInfoAutomatico(dict);
                    var resultadoAutomatico = new ResultadoAutomatico(mensaje, automatico);
                    return resultadoAutomatico;
                }
            }
        }
        private static BusquedaInfo MapToInfoBusqueda(IDictionary<string, object> busq)
        {
            var busqueda = new BusquedaInfo();

            if (busq.TryGetValue("Cuenta", out var idCuenta) && idCuenta != null)
                busqueda.IdCuenta = idCuenta.ToString();

            if (busq.TryGetValue("Cartera", out var cartera) && cartera != null)
                busqueda.Cartera = cartera.ToString();

            if (busq.TryGetValue("Producto", out var producto) && producto != null)
                busqueda.Producto = producto.ToString();

            if (busq.TryGetValue("Nombre", out var nombre) && nombre != null)
                busqueda.NombreDeudor = nombre.ToString();

            if (busq.TryGetValue("RFC", out var rfc) && rfc != null)
                busqueda.RFC = rfc.ToString();

            if (busq.TryGetValue("NúmeroCliente", out var numCliente) && numCliente != null)
                busqueda.NumeroCliente = numCliente.ToString();

            if (busq.TryGetValue("Situación", out var situacion) && situacion != null)
                busqueda.Situacion = situacion.ToString();

            if (busq.TryGetValue("idCartera", out var idCartera) && idCartera != null)
                busqueda.IdCartera = idCartera.ToString();

            if (busq.TryGetValue("Saldo", out var saldo) && saldo != null)
                busqueda.Saldo = saldo.ToString();

            if (busq.TryGetValue("Fecha_CambioActivación", out var activada) && activada != null && activada is DateTime dateTime)
            {
                busqueda.FechaActivacion = DateOnly.FromDateTime(dateTime);
            }

            if (busq.TryGetValue("Expediente", out var expediente) && expediente != null)
                busqueda.Expediente = expediente.ToString();


            return busqueda;

        }
        private static AutomaticoInfo MapInfoAutomatico(IDictionary<string, object> auto)
        {
            var automatico = new AutomaticoInfo();

            if (auto.TryGetValue("idCartera", out var idcartera) && idcartera != null)
                automatico.idCartera = idcartera.ToString();

            if (auto.TryGetValue("idCuenta", out var idcuenta) && idcuenta != null)
                automatico.idCuenta = idcuenta.ToString();

            if (auto.TryGetValue("NúmeroTelefónico", out var numerotelefonico) && numerotelefonico != null)
                automatico.numeroTelefonico = numerotelefonico.ToString();
            return automatico;
        }

        #region Phones

        public async Task<List<PhoneTranslated>> FetchPhones(string idCuenta)
        {
            var phonesList = await _searchRepository.GetPhones(idCuenta, 1);


            ClasesGespaNonStatic gespaPhonesList = new();
            gespaPhonesList.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaPhonesList.CargaCatalogos();

            var phonesTranslatedList = phonesList.Select(p => new PhoneTranslated
            {
                ID = p.ID,
                NúmeroTelefónico = p.NúmeroTelefónico,
                idTelefonía = p.idTelefonía,
                idOrigen = p.idOrigen,
                idClase = p.idClase,
                Estado = p.Estado,
                Municipio = p.Municipio,
                HusoHorario = p.HusoHorario,
                SegHorarioContacto = p.SegHorarioContacto,
                Extensión = p.Extensión,
                _Confirmado = p._Confirmado,
                Fecha_Insert = p.Fecha_Insert,
                Calificacion = p.Calificacion,
                Activo = p.Activo,
                Titulares = p.Titulares,
                Conocidos = p.Conocidos,
                Desconocidos = p.Desconocidos,
                SinContacto = p.SinContacto,
                IntentosViciDial = p.IntentosViciDial,
                Telefonia = BuscarEnValoresHashtable(gespaPhonesList._htValoresCatálogo, p.idTelefonía.ToString()),
                Origen = BuscarEnValoresHashtable(gespaPhonesList._htValoresCatálogo, p.idOrigen.ToString()),
                Clase = BuscarEnValoresHashtable(gespaPhonesList._htValoresCatálogo, p.idClase.ToString())
            }).ToList();


            return phonesTranslatedList;
        }

        public async Task<bool> ValidatePhone(string telefono, string idCuenta)
        {
            // Obtiene la lista de teléfonos asociados a la cuenta
            var phonesListValidate = await FetchPhones(idCuenta);

            // Retorna true solo si:
            // 1. La lista de teléfonos no es nula
            // 2. La lista contiene al menos un teléfono
            // 3. El número proporcionado tiene al menos 10 caracteres después de eliminar espacios en blanco
            // 4. El número proporcionado existe dentro de la lista de teléfonos obtenidos
            return
                phonesListValidate != null
                && phonesListValidate.Count > 0
                && telefono.Trim().Length >= 10
                && phonesListValidate.Any(p => p.NúmeroTelefónico == telefono);
        }

        public async Task<string> SaveNewPhone(NewPhoneRequest newPhoneData)
        {
            DataTable catalogosTable = await _ejecutivoRepository.VwCatalogos();

            ClasesGespaNonStatic gespaPhones = new();

            //Obtener los idValor para el constructor del nuevo teléfono.
            int idTelefonia = gespaPhones.GetIdValor(catalogosTable, "Telefonía", newPhoneData.Telefonia);
            int idOrigen = gespaPhones.GetIdValor(catalogosTable, "Orígenes", "Gestión");
            int idClase = gespaPhones.GetIdValor(catalogosTable, "Clases", newPhoneData.ClaseTelefono);

            NewPhone newPhone = new NewPhone(
                numeroTelefonico: newPhoneData.PhoneNumber,
                idTelefonia,
                idOrigen,
                idClase,
                newPhoneData.HorarioContacto,
                estado: "",
                newPhoneData.Extension,
                1,
                newPhoneData.Cuenta,
                newPhoneData.IdEjecutivo
                );

            string savePhoneResult = await ValidateNewPhone(catalogosTable, newPhone, false);


            return savePhoneResult;
        }

        public async Task<string> SaveNewPhoneRe(NewPhoneRe newPhoneData)
        {
            DataTable catalogosTable = await _ejecutivoRepository.VwCatalogos();

            //Obtener los idValor para el constructor del nuevo teléfono.
            int idTelefonia = await GetIdValor(catalogosTable, "Telefonía", newPhoneData.NumeroTelefonico);
            int idOrigen = await GetIdValor(catalogosTable, "Orígenes", "Gestión");
            int idClase = await GetIdValor(catalogosTable, "Clases", newPhoneData.IdClase);

            NewPhone newPhone = new NewPhone(
                numeroTelefonico: newPhoneData.NumeroTelefonico,
                idTelefonia,
                idOrigen,
                idClase,
                newPhoneData.HorarioContacto,
                estado: "",
                newPhoneData.Extension,
                1,
                newPhoneData.IdCuenta,
                newPhoneData.IdEjecutivo
                );

            string savePhoneResult = await ValidateNewPhone(catalogosTable, newPhone, false);


            return savePhoneResult;
        }

        /// <summary>
        /// Inserta en la base de datos un nuevo teléfono de la cuenta.
        /// </summary>
        /// <param name="Cuenta">Cuenta a la que corresponde el nuevo teléfono.</param>
        /// <param name="TeléfonoCuenta">Nuevo teléfono que se guardará.</param>
        /// <param name="OmiteDuplicidad">Indica si existió duplicidad con los teléfonos de la cuenta.</param>
        /// <returns>Mensaje de error.</returns>
        private async Task<string> ValidateNewPhone(DataTable dtCatalogos, NewPhone telefonoCuenta, bool omitirDuplicidad)
        {
            int idTelefonía = telefonoCuenta.IdTelefonia;
            int idClase = telefonoCuenta.IdClase;
            int idOrigen = telefonoCuenta.IdOrigen;

            long lNumeroTelefonico = 0;
            object segHorarioContacto = null;

            if (!long.TryParse(telefonoCuenta.NumeroTelefonico, out lNumeroTelefonico))
            {
                return "Ingrese un número telefónico válido (" + telefonoCuenta.NumeroTelefonico + ").";
            }

            bool phoneExists = await ValidatePhone(telefonoCuenta.NumeroTelefonico, telefonoCuenta.IdCuenta);

            if (phoneExists)
            {
                if (omitirDuplicidad)
                {
                    return "";
                }
                else
                {
                    return "El teléfono (" + telefonoCuenta.NumeroTelefonico + ") ya es parte de la cuenta.";
                }

            }

            string phoneResult;

            if (!telefonoCuenta.ValidacionNumeroTelefonico(out phoneResult))
            {
                return phoneResult;
            }

            var nombresId = ObtenerNombresId(dtCatalogos);

            if (idOrigen == 0 || !nombresId.ContainsKey(idOrigen.ToString()) || nombresId[idOrigen.ToString()] != "idOrigen")
            {
                return "El orígen del teléfono es inválido.";
            }
            if (idClase == 0 || !nombresId.ContainsKey(idClase.ToString()) || nombresId[idClase.ToString()] != "idClase")
            {
                return "La clase de teléfono es inválida.";
            }

            if (!(telefonoCuenta.HorarioContacto?.Hours > 6 && telefonoCuenta.HorarioContacto?.Hours < 23))
            {
                telefonoCuenta.HorarioContacto = null;
            }

            // 🔹 Asegurar que se espera correctamente el resultado asíncrono
            var newPhoneResult = await _searchRepository.RegisterNewPhone(telefonoCuenta);

            if (newPhoneResult == null)
            {
                return "Fallo al guardar el teléfono en la base de datos.";
            }

            // 🔹 Verifica si el resultado contiene un mensaje de error
            if (newPhoneResult is IDictionary<string, object> phoneResultDict &&
                phoneResultDict.TryGetValue("Resultado", out object resultadoObj) && resultadoObj != null)
            {
                return Convert.ToString(resultadoObj);
            }

            return "";
        }


        private static Dictionary<string, string> ObtenerNombresId(DataTable dtCatalogos)
        {
            var nombresId = new Dictionary<string, string>();

            foreach (DataRow row in dtCatalogos.Rows)
            {
                string idValor = row["idValor"].ToString();
                string nombreId = row["NombreId"].ToString();

                nombresId.TryAdd(idValor, nombreId);
            }

            return nombresId;
        }


        #endregion

        #region InfoProductos
        public async Task<Dictionary<string, object>> CalculateProductData(string idCuenta)
        {
            var resultado = new Dictionary<string, object>();

            var camposPantalla = await _searchRepository.GetCamposPantalla(1, 1);
            var producto = await _searchRepository.GetProducto(idCuenta);

            DateTime? limitDay = null;
            if (((IDictionary<string, object>)producto).ContainsKey("batchdate"))
            {
                limitDay = Convert.ToDateTime(producto.batchdate);
                resultado["Dif_diasTotales"] = (DateTime.Now - limitDay.Value).Days;
            }

            foreach (var campo in camposPantalla)
            {
                string nombreCampo = campo.NombreCampo;
                string aliasCampo = campo.AliasCampo;

                // Asegurar que el resultado de CampoCalculado se espere correctamente
                object valorCampo = await CampoCalculado(producto, nombreCampo);
                object valorFormateado = Formato(valorCampo, campo.IdFormatoCampo);

                resultado[aliasCampo] = valorFormateado;
            }

            return resultado;
        }

        public async Task<object> CampoCalculado(dynamic producto, string expresion)
        {
            if (producto == null)
                return "";

            // Convertir el resultado en un diccionario y eliminar espacios en blanco de las claves
            var valoresProducto = ((IDictionary<string, object>)producto)
                .ToDictionary(k => k.Key.Trim(), v => v.Value ?? ""); // Agregar Trim() a la clave

            string[] campos = expresion.Split(['[', ']'], StringSplitOptions.RemoveEmptyEntries);
            string resultado = expresion;

            foreach (var campo in campos)
            {
                if (valoresProducto.ContainsKey(campo))
                {
                    resultado = resultado.Replace("[" + campo + "]", valoresProducto[campo].ToString().Trim());
                }
            }

            if (expresion.StartsWith('#'))
            {
                return EvaluateDate(resultado.Replace("#", ""));
            }
            else if (campos.Length > 1 && (expresion.Contains('+') || expresion.Contains('-') || expresion.Contains('*') || expresion.Contains('/') || expresion.Contains('^')))
            {
                return Evaluate(resultado);
            }

            return resultado;
        }

        /// <summary>
        /// Cambia el formato del texto
        /// </summary>
        /// <param name="Texto">Texto que va cambiar el formato.</param>
        /// <param name="Formato">1 Texto, 2 Número, 3 Moneda, 4 Fecha</param>
        static public string Formato(object Texto, object Formato)
        {

            if (Texto == null)
                return "";

            string sTexto = Texto.ToString();

            switch (Formato.ToString())
            {
                case "2":
                    double fTexto;
                    sTexto = double.TryParse(sTexto, out fTexto) ? fTexto.ToString("#,#") : sTexto;
                    break;

                case "3":
                    double dTexto;
                    sTexto = double.TryParse(sTexto, out dTexto) ? dTexto.ToString("$ #,#.00") : sTexto; //C2
                    break;

                case "4":
                    sTexto = sTexto.Replace("12:00:00 a.m.", "");
                    DateTime dtTexto = new DateTime();
                    if (TryParseDate(sTexto, out dtTexto))
                        sTexto = dtTexto.ToString("dd/MM/yyyy");
                    break;

                case "5":
                    double pTexto;
                    sTexto = double.TryParse(sTexto, out pTexto) ? Math.Round(pTexto * 100, 0) + " %" : sTexto;
                    break;
            }

            return sTexto;
        }

        /// <summary>
        /// Evalua una expresión aritmética y devuelve el resultado, 0 si fue incorrecta.
        /// </summary>
        /// <param name="Tabla">Expresión aritmética.</param>
        /// <param name="Número">Indica si se va a devolver un número</param>
        /// <param name="Fecha">Indica si se va a evaluar una fecha</param>
        static public double Evaluate(string expression)
        {

            if (Regex.Matches(expression, @"[a-zA-Z]").Count > 0)
                return 0;

            DataTable dtExpression = new DataTable();
            double dEvaluation = 0;
            expression = expression.Replace("%", "/100");

            try
            {
                dtExpression.Columns.Add(new DataColumn("Eval", typeof(double), expression));
                dtExpression.Rows.Add(dtExpression.NewRow());
                double.TryParse(dtExpression.Rows[0]["Eval"].ToString(), out dEvaluation);
            }
            catch (Exception)
            {
                //ErrorLogClass.LogError("Evaluate", expression);
            }

            return dEvaluation;
        }

        static public object EvaluateDate(string expression)
        {

            if (Regex.Matches(expression, @"[a-zA-Z]").Count > 0)
                return new DateTime(0);

            DateTime dtPrimero = new DateTime();
            DateTime dtSegundo = new DateTime();
            int iDías = 0;

            string[] sExpresión = expression.Trim().Split(' ');


            if (sExpresión.Length != 3 || !TryParseDate(sExpresión[0], out dtPrimero))
                return "";

            switch (sExpresión[1])
            {

                case "+":
                    if (int.TryParse(sExpresión[2], out iDías))
                        return dtPrimero.AddDays(iDías);
                    break;

                case "-":
                    if (TryParseDate(sExpresión[2], out dtSegundo))
                        return (dtPrimero - dtSegundo).TotalDays;
                    else if (int.TryParse(sExpresión[2], out iDías))
                        return dtPrimero.AddDays(-iDías);
                    break;
            }

            return sExpresión[0];
        }

        static public bool TryParseDate(string Text, out DateTime Date)
        {
            if (DateTime.TryParse(Text, out Date) ||
                        DateTime.TryParseExact(Text, new string[] { "yyyyMMdd" }, null, System.Globalization.DateTimeStyles.None, out Date))
                return true;
            return false;
        }

        #endregion

        #region Domicilios

        /// <summary>
        /// Obtiene los domicilios y visitas asociadas a una cuenta y cartera.
        /// </summary>
        /// <param name="idCartera">Identificador de la cartera.</param>
        /// <param name="idCuenta">Identificador de la cuenta.</param>
        /// <returns>Un objeto anónimo con las listas de domicilios y visitas.</returns>
        public async Task<DomiciliosVisitasResult> DomiciliosVisitas(int idCartera, string idCuenta)
        {
            // Obtiene la lista de domicilios
            var domicilios = await _searchRepository.GetDomicilios(idCuenta, idCartera);

            // Obtiene la lista de visitas
            var visitas = await _searchRepository.GetVisitas(idCuenta, idCartera);

            // Validación de resultados
            if (domicilios == null || visitas == null)
            {
                return new DomiciliosVisitasResult { Error = "No se encontraron domicilios o visitas para la cuenta y cartera especificadas." };
            }

            //Ordenar las visitas por fecha y hora, de más reciente a más antigua.
            visitas = visitas.OrderByDescending(v => v.Fecha).ThenByDescending(v => v.Hora).ToList();

            await TraduceListaIdAValores(visitas, "idCDomicilio, Comentario");
            // Mapear los domicilios a una lista de DomicilioTranslated con nuevos campos (Información y Clase)para traducir los valores de sus IDs.
            var domiciliosTraducidos = MapearDomicilios(domicilios);


            //await TraduceListaIdAValores(domiciliosTraducidos, "idDomicilio, Comentario");

            await LlenaDomicilios(domiciliosTraducidos, 1);


            // Devuelve un objeto DomiciliosVisitasResult con las listas de domicilios y visitas
            return new DomiciliosVisitasResult { Domicilios = domiciliosTraducidos, Visitas = visitas };

        }

        /// <summary>
        /// Obtiene las relaciones de catálogos para los dropdowns de domicilios.
        /// </summary>
        /// <returns>Un objeto CatalogoDomicilios con las listas de catálogos.</returns>
        public async Task<CatalogoDomicilios> RelacionesDomicilios()
        {
            ClasesGespaNonStatic gespaDomicilios = new();

            // Cargar catálogos y relaciones sobre la instancia de ClasesGespa.
            gespaDomicilios.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaDomicilios.CargaCatalogos();

            gespaDomicilios.dtRelaciones = await _ejecutivoRepository.VwRelaciones();
            gespaDomicilios.Relaciones();

            // Obtener Hashtables de relaciones y valores de catálogos.
            Hashtable htInformacion = gespaDomicilios.Relaciones("Información", "Modificables", "Positivo", "Negativo");
            Hashtable htClases = gespaDomicilios.Relaciones("Clases", "Modificables", "Positivo");
            Hashtable htValoresCatalogo = gespaDomicilios._htValoresCatálogo;

            // Obtener listas de catálogos.
            List<CatalogoItem> listaInformacion = ObtenerCatalogoInformacion(htInformacion, htValoresCatalogo);
            List<CatalogoItem> listaClases = ObtenerCatalogoClases(htClases, htValoresCatalogo);

            CatalogoDomicilios catalogos = new()
            {
                Informacion = listaInformacion,
                Clases = listaClases
            };

            return catalogos;
        }

        public async Task<(string, bool)> UpdateAddressInfo(UpdateAddressInfoRequest domicilioInfoUpdate)
        {
            var domicilios = await _searchRepository.GetDomicilios(domicilioInfoUpdate.IdCuenta, domicilioInfoUpdate.IdCartera);

            bool domicilioAsignado = domicilios.Any(item => item.IdDomicilio == domicilioInfoUpdate.IdDomicilio);
            if (!domicilioAsignado)
            {
                return ("El domicilio no está asignado a la cuenta.", false);
            }

            // Ejecuta la actualización y valida el resultado
            var updateInfoResult = await _searchRepository.UpdateAddressInfo(domicilioInfoUpdate);

            if (updateInfoResult is null || updateInfoResult != 1)
            {
                return ("No se pudo actualizar el campo 'idInformación' del domicilio. Verifique los datos proporcionados.", false);
            }

            return ("Campo 'idInformación' del domicilio actualizado con éxito.", true);


        }

        public async Task<(string, bool)> UpdateAddressClass(UpdateAddressClassRequest domicilioClassUpdate)
        {
            var domicilios = await _searchRepository.GetDomicilios(domicilioClassUpdate.IdCuenta, domicilioClassUpdate.IdCartera);

            bool domicilioAsignado = domicilios.Any(item => item.IdDomicilio == domicilioClassUpdate.IdDomicilio);
            if (!domicilioAsignado)
            {
                return ("El domicilio no está asignado a la cuenta.", false);
            }

            var updateClassResult = await _searchRepository.UpdateAddressClass(domicilioClassUpdate);

            if (updateClassResult is null || updateClassResult != 1)
            {
                return ("No se pudo actualizar el campo 'idClase' del domicilio. Verifique los datos proporcionados.", false);
            }

            return ("Campo 'idClase' del domicilio actualizado con éxito.", false);

        }

        public async Task<(NewAddressResult, string, bool)> SaveNewAddress(NewAddressRequest newAddressData)
        {
            NewAddressResult result = null;

            if (newAddressData.Calle.Trim().Length < 5)
            {
                return (result, "Los datos de calle son ambiguos.", false);
            }

            if (newAddressData.NumeroExterior.Trim().Length == 0)
            {
                return (result, "Los datos de calle son ambiguos.", false);
            }

            var codigosPostales = await _searchRepository.SearchCodigosPostalesByCode(newAddressData.CodigoPostal);

            if (codigosPostales == null || codigosPostales.Count == 0)
            {
                return (result, "Ingrese un código postal válido.", false);
            }

            int? idCodigoPostal = codigosPostales.FirstOrDefault()?.IdCódigoPostal;


            var producto = await _searchRepository.GetProducto(newAddressData.IdCuenta);
            if (producto == null)
            {
                return (result, "No se encontró información del producto para la cuenta del nuevo domicilio.", false);

            }

            bool bForaneo = newAddressData.IdProducto == 35 ||
                (newAddressData.IdCartera == 1 &&
                 (producto.recoveredcode.StartsWith("7") ||
                  producto.recoveredcode.StartsWith("8") ||
                  producto.recoveredcode.StartsWith("9")));

            // Validación basada en el código original
            if (idCodigoPostal == 0 && !bForaneo)
            {
                return (result, "El identificador de código postal es inválido.", false);
            }

            var newAddress = new NewAddress
            {
                IdCartera = newAddressData.IdCartera,
                IdCuenta = newAddressData.IdCuenta,
                IdEjecutivo = newAddressData.IdEjecutivo,
                Calle = newAddressData.Calle,
                NumeroExterior = newAddressData.NumeroExterior,
                NumeroInterior = string.IsNullOrWhiteSpace(newAddressData.NumeroInterior) ? null : newAddressData.NumeroInterior.Trim(),
                IdCodigoPostal = bForaneo ? 0 : idCodigoPostal.Value, // Si es foráneo, asignamos 0
                Colonia = newAddressData.Colonia,
                IdClase = newAddressData.IdClase,
                Municipio = bForaneo && !string.IsNullOrWhiteSpace(newAddressData.Municipio) ? newAddressData.Municipio.Trim() : null,
                Estado = bForaneo && !string.IsNullOrWhiteSpace(newAddressData.Estado) ? newAddressData.Estado.Trim() : null
            };


            // Insertar en base de datos
            result = await _searchRepository.InsertNewAddress(newAddress);

            if (result == null)
            {
                return (result, "Error al guardar el domicilio.", false);
            }


            return (result, "Domicilio guardado exitosamente.", true);
        }


        /// <summary>
        /// Obtiene la lista de catálogos de "Información" a partir de un Hashtable de relaciones y valores.
        /// </summary>
        /// <param name="htInformacion">Hashtable de relaciones de "Información".</param>
        /// <param name="htValoresCatalogo">Hashtable de valores de catálogos.</param>
        /// <returns>Lista de objetos CatalogoItem para el catálogo de "Información".</returns>
        public static List<CatalogoItem> ObtenerCatalogoInformacion(Hashtable htInformacion, Hashtable htValoresCatalogo)
        {
            List<CatalogoItem> listaInformacion = new List<CatalogoItem>();

            // Itera a través de las claves del Hashtable de relaciones
            foreach (string idValor in htInformacion.Keys)
            {
                // Verifica si la clave existe en el Hashtable de valores de catálogos
                if (htValoresCatalogo.ContainsKey(idValor))
                {
                    // Crea un nuevo objeto CatalogoItem con el ID y el valor correspondiente
                    // y lo agrega a la lista
                    listaInformacion.Add(new CatalogoItem { Id = idValor, Valor = htValoresCatalogo[idValor].ToString() });
                }
            }

            // Remueve los elementos de la lista cuyo valor sea "Verificada"
            listaInformacion.RemoveAll(item => item.Valor == "Verificada");

            return listaInformacion;
        }

        /// <summary>
        /// Obtiene la lista de catálogos de "Clases" a partir de un Hashtable de relaciones y valores.
        /// </summary>
        /// <param name="htClases">Hashtable de relaciones de "Clases".</param>
        /// <param name="htValoresCatalogo">Hashtable de valores de catálogos.</param>
        /// <returns>Lista de objetos CatalogoItem para el catálogo de "Clases".</returns>
        public static List<CatalogoItem> ObtenerCatalogoClases(Hashtable htClases, Hashtable htValoresCatalogo)
        {
            List<CatalogoItem> listaClases = new List<CatalogoItem>();

            // Itera a través de las claves del Hashtable de relaciones
            foreach (string idClase in htClases.Keys)
            {
                // Verifica si la clave existe en el Hashtable de valores de catálogos
                if (htValoresCatalogo.ContainsKey(idClase))
                {
                    // Crea un nuevo objeto CatalogoItem con el ID y el valor correspondiente
                    // y lo agrega a la lista
                    listaClases.Add(new CatalogoItem { Id = idClase, Valor = htValoresCatalogo[idClase].ToString() });
                }
            }

            // Remueve los elementos de la lista cuyos valores sean "Fax", "Celular", "Conmutador", "Erroneo" o "Recados"
            listaClases.RemoveAll(item => item.Valor == "Fax");
            listaClases.RemoveAll(item => item.Valor == "Celular");
            listaClases.RemoveAll(item => item.Valor == "Conmutador");
            listaClases.RemoveAll(item => item.Valor == "Erroneo");
            listaClases.RemoveAll(item => item.Valor == "Recados");


            return listaClases;
        }

        /// <summary>
        /// Convierte una lista de objetos Domicilio a una lista de objetos DomicilioTranslated dado que esta última contiene
        /// los campos necesarios para guardar la traducción de los idValores a texto.
        /// </summary>
        /// <param name="listaDomicilios">Lista de domicilios originales.</param>
        /// <returns>Lista de domicilios traducidos.</returns>
        public List<DomicilioTranslated> MapearDomicilios(List<Domicilio> listaDomicilios)
        {
            List<DomicilioTranslated> listaTraducida = [];

            foreach (var domicilio in listaDomicilios)
            {
                listaTraducida.Add(new DomicilioTranslated
                {
                    IdCartera = domicilio.IdCartera,
                    IdCuenta = domicilio.IdCuenta,
                    IdDomicilio = domicilio.IdDomicilio,
                    Fecha_Insert = domicilio.Fecha_Insert,
                    IdEjecutivo = domicilio.IdEjecutivo,
                    IdInformación = domicilio.IdInformación,
                    Calle = domicilio.Calle,
                    NúmeroExterior = domicilio.NúmeroExterior,
                    NúmeroInterior = domicilio.NúmeroInterior,
                    IdCódigoPostal = domicilio.IdCódigoPostal,
                    CódigoPostal = domicilio.CódigoPostal,
                    ColoniaLocalidad = domicilio.ColoniaLocalidad,
                    DelegaciónMunicipio = domicilio.DelegaciónMunicipio,
                    Estado = domicilio.Estado,
                    FechaHora_Información = domicilio.FechaHora_Información,
                    IdLogProceso = domicilio.IdLogProceso,
                    IdClase = domicilio.IdClase,
                    IdOrígen = domicilio.IdOrígen
                });
            }

            return listaTraducida;
        }

        /// <summary>
        /// Traduce los identificadores en una lista de objetos a sus valores correspondientes usando un catálogo.
        /// También aplica formateo especial a ciertos tipos de datos.
        /// </summary>
        /// <typeparam name="T">Tipo genérico de los objetos en la lista.</typeparam>
        /// <param name="lista">Lista de objetos a traducir.</param>
        /// <param name="columnasAOcultar">Columnas que deben excluirse del proceso de traducción.</param>
        public async Task TraduceListaIdAValores<T>(List<T> lista, string columnasAOcultar = "")
        {
            // Definir qué columnas deben ocultarse
            HashSet<string> columnasExcluidas = new(columnasAOcultar.Replace(" ", "").Split(','));

            ClasesGespaNonStatic gespaTraduce = new();

            gespaTraduce.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaTraduce.CargaCatalogos();

            foreach (var item in lista)
            {
                foreach (PropertyInfo propiedad in typeof(T).GetProperties())
                {
                    string nombreColumna = propiedad.Name;

                    // Omitimos las columnas que deben ocultarse
                    if (columnasExcluidas.Contains(nombreColumna)) continue;

                    // Si es un ID de catálogo, traducirlo a su valor real
                    if (gespaTraduce._htNombreId.ContainsValue(nombreColumna))
                    {
                        string idValor = propiedad.GetValue(item)?.ToString()?.Trim() ?? "";
                        if (gespaTraduce._htValoresCatálogo.ContainsKey(idValor))
                        {
                            propiedad.SetValue(item, gespaTraduce._htValoresCatálogo[idValor]?.ToString());
                        }
                    }
                    // Formateo específico de columnas
                    else if (nombreColumna == "IdCuenta" || nombreColumna == "idCuenta")
                    {
                        string idValor = propiedad.GetValue(item)?.ToString() ?? "";
                        propiedad.SetValue(item, idValor.Length >= 4 ? idValor.Substring(idValor.Length - 4) : idValor);
                    }
                    else if (nombreColumna == "NúmeroTelefónico")
                    {
                        string idValor = propiedad.GetValue(item)?.ToString() ?? "";
                        propiedad.SetValue(item, gespaTraduce.MáscaraTeléfono(idValor));
                    }
                    else if (nombreColumna.StartsWith("FechaHora") || nombreColumna == "Seguimiento")
                    {
                        string idValor = propiedad.GetValue(item)?.ToString() ?? "";
                        if (!string.IsNullOrEmpty(idValor) && DateTime.TryParse(idValor, out DateTime fechaHora))
                        {
                            // Verificamos si la propiedad es de tipo DateTime o string
                            if (propiedad.PropertyType == typeof(DateTime) || propiedad.PropertyType == typeof(DateTime?))
                            {
                                propiedad.SetValue(item, fechaHora); // Asignar como DateTime
                            }
                            else
                            {
                                propiedad.SetValue(item, fechaHora.ToString("dd/MM/yyyy HH:mm")); // Asignar como string si aplica
                            }
                        }
                    }
                    else if (nombreColumna.StartsWith("Monto") || nombreColumna.Contains("Descuento"))
                    {
                        string idValor = propiedad.GetValue(item)?.ToString() ?? "";
                        if (decimal.TryParse(idValor, out decimal monto))
                        {
                            propiedad.SetValue(item, gespaTraduce.FormatoPesos(monto)); // Aplicando formato directamente                        }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Llena información de una lista de domicilios basada en un identificador específico.
        /// </summary>
        /// <param name="listaDomicilios">Lista de domicilios a procesar.</param>
        /// <param name="iDomicilio">Índice del domicilio a actualizar.</param>
        public async Task LlenaDomicilios(List<DomicilioTranslated> listaDomicilios, int iDomicilio)
        {
            if (listaDomicilios == null || listaDomicilios.Count < iDomicilio || iDomicilio <= 0)
            {
                return; // No hay datos para procesar
            }

            ClasesGespaNonStatic gespaDomicilio = new()
            {
                dtCatalogos = await _ejecutivoRepository.VwCatalogos()
            };

            gespaDomicilio.CargaCatalogos();

            // Obtener el domicilio correspondiente
            foreach (var domicilio in listaDomicilios)
            {
                // Convertir y obtener idClase
                int.TryParse(domicilio.IdClase?.ToString(), out int idClase);
                int.TryParse(domicilio.IdOrígen?.ToString(), out int idOrigen);

                InformacionDomicilio(domicilio, gespaDomicilio._htValoresCatálogo, idClase == 0 ? 1901 : idClase);

                domicilio.Orígen = gespaDomicilio._htValoresCatálogo.ContainsKey(idOrigen.ToString())
                    ? gespaDomicilio._htValoresCatálogo[idOrigen.ToString()].ToString()
                    : "Sin Clase";

                domicilio.Estado = gespaDomicilio.ObtenerNombreEstado(domicilio.Estado?.Trim() ?? "");

                domicilio.Fecha_Insert = DateTime.TryParse(gespaDomicilio.Fecha(domicilio.Fecha_Insert), out DateTime fechaInsert) ? fechaInsert : (DateTime?)null;

                // Aquí va el nuevo método que actualiza la información de los domicilios
                if (int.TryParse(domicilio.IdCódigoPostal?.ToString(), out int idCodigoPostal) && idCodigoPostal > 0)
                {
                    var codigosPostales = await _searchRepository.SearchCodigosPostales(idCodigoPostal);

                    if (codigosPostales != null && codigosPostales.Count > 0)
                    {
                        var codigoPostal = codigosPostales[0]; // Tomamos el primer resultado (suponiendo que es único)

                        // Actualizamos el domicilio con la información del código postal
                        domicilio.CódigoPostal = codigoPostal.CódigoPostal;
                        domicilio.ColoniaLocalidad = string.IsNullOrEmpty(domicilio.ColoniaLocalidad) ? codigoPostal.Colonia : domicilio.ColoniaLocalidad;
                        domicilio.DelegaciónMunicipio = codigoPostal.Municipio;
                        domicilio.Estado = codigoPostal.Estado;
                    }
                }

            }

        }

        /// <summary>
        /// Asigna la información y la clase de un domicilio basado en los valores de un catálogo.
        /// </summary>
        /// <param name="domicilio">Objeto de tipo <see cref="DomicilioTranslated"/> que se actualizará.</param>
        /// <param name="valoresCatalogo">Hashtable que contiene los valores del catálogo.</param>
        /// <param name="idClase">Identificador de la clase del domicilio.</param>
        public static void InformacionDomicilio(DomicilioTranslated domicilio, Hashtable valoresCatalogo, int idClase)
        {
            // Verifica si tanto IdInformación como IdClase tienen el valor predeterminado (1901).
            if (domicilio.IdInformación == 1901 && domicilio.IdClase == 1901)
            {
                // Busca el valor de IdInformación en el catálogo
                string valorInformacion = BuscarEnValoresHashtable(valoresCatalogo, domicilio.IdInformación.ToString());

                // Si se encuentra un valor en el catálogo, se asigna; de lo contrario, se marca como "Desconocido".
                domicilio.Información = string.IsNullOrWhiteSpace(valorInformacion) ? "Desconocido" : valorInformacion;
            }
            else
            {
                // Si el domicilio tiene un IdInformación válido, se intenta obtener su descripción del catálogo.
                if (domicilio.IdInformación is not null)
                {
                    string? valorInformacion = BuscarEnValoresHashtable(valoresCatalogo, domicilio.IdInformación.ToString());

                    // Si existe un valor en el catálogo, se asigna; de lo contrario, se marca como "Desconocido".
                    domicilio.Información = valorInformacion ?? "Desconocido";
                }

                // Se intenta obtener la descripción de la clase utilizando su ID en el catálogo.
                if (idClase.ToString() is not null)
                {
                    string? valorClase = BuscarEnValoresHashtable(valoresCatalogo, idClase.ToString());

                    // Si se encuentra un valor en el catálogo, se asigna; de lo contrario, se marca como "Sin Clase".
                    domicilio.Clase = valorClase ?? "Sin Clase";
                }
            }
        }

        /// <summary>
        /// Busca un valor en un Hashtable basado en una clave específica.
        /// </summary>
        /// <param name="valoresCatalogo">Hashtable que contiene pares clave-valor.</param>
        /// <param name="valorBuscado">Clave a buscar dentro del Hashtable.</param>
        /// <returns>El valor asociado a la clave si se encuentra; de lo contrario, retorna <c>null</c>.</returns>
        public static string BuscarEnValoresHashtable(Hashtable valoresCatalogo, string valorBuscado)
        {
            // Recorre todas las entradas en el Hashtable.
            foreach (DictionaryEntry entry in valoresCatalogo)
            {
                // Compara la clave actual con el valor buscado.
                if (entry.Key.ToString() == valorBuscado)
                {
                    return entry.Value.ToString(); // Devuelve el valor asociado si se encuentra.
                }
            }

            return null; // Retorna null si no se encuentra la clave en el Hashtable.
        }

        /// <summary>
        /// Busca información de códigos postales basada en un código postal específico.
        /// </summary>
        /// <param name="codigoPostal">Código postal a buscar.</param>
        /// <returns>Una lista de <see cref="CodigosPostales"/> si se encuentran resultados; de lo contrario, retorna <c>null</c>.</returns>
        public async Task<List<CodigosPostales>> FindPostalCodeInfo(int codigoPostal)
        {
            // Obtiene la lista de códigos postales desde el repositorio.
            var codigosPostales = await _searchRepository.SearchCodigosPostales(codigoPostal);

            // Si la lista no está vacía, se retorna; de lo contrario, se devuelve null.
            return (codigosPostales != null && codigosPostales.Count > 0) ? codigosPostales : null;
        }




        #endregion

        public async Task<dynamic> GetConversacionData(string idCuenta, string correo)
        {
            var conversacionResult = await _searchRepository.ConversacionData(idCuenta, correo);

            return conversacionResult;
        }

        public async Task<int> GetIdValor(DataTable catalogos, string catalogo, object valor)
        {
            if (valor == null)
                return 0;
            // Verifica que la DataTable no sea nula y contenga filas
            if (catalogos == null || catalogos.Rows.Count == 0)
                return 0;

            // Filtra las filas que coincidan con el catálogo y el valor buscado
            DataRow[] drFilas = catalogos.Select($"Catálogo = '{catalogo}' AND Valor = '{valor}'");

            // Si hay coincidencias, retorna el idValor, de lo contrario, retorna 0
            return drFilas.Length > 0 ? Convert.ToInt32(drFilas[0]["idValor"]) : 0;

        }

    }
}
