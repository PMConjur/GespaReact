using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using NoriAPI.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using NoriAPI.Models.Busqueda;
using Microsoft.AspNetCore.Authorization;
using NoriAPI.Models.Phones;
using System.Data;
using System.Text.Json;
using System;
using System.Globalization;
using NoriAPI.Models.Domicilios;
using Azure.Messaging;

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/search-customer")]
    [Authorize]
    public class CustomerSearchController : ControllerBase

    {
        private readonly IConfiguration _configuration;
        private readonly ISearchService _searchService;

        public CustomerSearchController(IConfiguration configuration, ISearchService searchService)
        {
            _configuration = configuration;
            _searchService = searchService;
        }

        [HttpGet("busqueda-cuenta")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromQuery] string filtro, string ValorBusqueda)
        {
            var Busqueda = await _searchService.ValidateBusqueda(filtro, ValorBusqueda);

            if (!Busqueda.Mensaje.IsNullOrEmpty())
            {
                return BadRequest(new { Busqueda.Mensaje });

            }
            return Ok(new { Busqueda.ListaResultados });
        }

        [HttpGet("automatico-ejecutivo")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoAutomatico>> Automatico([FromQuery] int numEmpleado)

        {
            var Automatico = await _searchService.ValidateAutomatico(numEmpleado);

            if (!Automatico.Mensaje.IsNullOrEmpty())
            {
                return Ok(new { Automatico.Mensaje });
            }


            return Ok(Automatico.Cuenta);
        }

        [HttpGet("phones")]
        public async Task<ActionResult<IEnumerable<PhoneTranslated>>> GetPhones([FromQuery] string idCuenta)
        {
            var phones = await _searchService.FetchPhones(idCuenta);
            if (phones == null || phones.Count == 0)
            {
                return NotFound();
            }
            return Ok(phones);
        }

        [HttpGet("products-info")]
        
        public async Task<IActionResult> GetProductData([FromQuery] string idCuenta)
        {
            var datos = await _searchService.CalculateProductData(idCuenta);
            return Ok(datos);
        }

        [HttpPost("validate-phone")]
        public async Task<IActionResult> ValidatePhone([FromBody] ValidatePhoneRequest validate)
        {
            var phoneValidation = await _searchService.ValidatePhone(validate.Telefono, validate.IdCuenta);
            if (!phoneValidation)
            {
                return NotFound(new { exists = phoneValidation });
            }
            return Ok(new { exists = phoneValidation });
        }

        [HttpPut("save-new-phone")]
        public async Task<IActionResult> SaveNewPhone([FromBody] NewPhoneRequest newPhoneData)
        {
            var phone = await _searchService.SaveNewPhone(newPhoneData);

            if (phone == null)
            {
                return BadRequest();
            }
            if (phone.ToString() != "")
            {
                return BadRequest(new { result = phone.ToString() });
            }
            return Ok(new { result = "Teléfono insertado con éxito" });
        }

        #region Domicilios

        /// <summary>
        /// Obtiene los domicilios y visitas asociadas a una cuenta y cartera.
        /// </summary>
        /// <param name="idCartera">Identificador de la cartera.</param>
        /// <param name="idCuenta">Identificador de la cuenta.</param>
        /// <returns>Un objeto JSON con las listas de domicilios y visitas.</returns>
        [HttpGet("domicilios-visitas")]
        public async Task<ActionResult<DomiciliosVisitasResult>> GetVisitsAndAddresses([FromQuery] int idCartera, string idCuenta)
        {

            var result = await _searchService.DomiciliosVisitas(idCartera, idCuenta);

            if (result == null || (result.Domicilios == null && result.Visitas == null && result.Error == null))
            {
                return NotFound("No se encontraron domicilios o visitas para la cuenta y cartera especificadas.");
            }

            if (result.Error != null)
            {
                return BadRequest(result);
            }

            return Ok(result);

        }

        /// <summary>
        /// Obtiene las listas de catálogos de "Información" y "Clases" para los dropdowns de domicilios.
        /// </summary>
        /// <returns>Un objeto CatalogoDomicilios con las listas de catálogos.</returns>
        [HttpGet("domicilios-dropdown-info")]
        public async Task<ActionResult<CatalogoDomicilios>> InfoDropDownsDomicilios()
        {

            var visitAddresses = await _searchService.RelacionesDomicilios();

            // Si ambas listas están vacías, devolver NotFound
            if (visitAddresses.Informacion.Count == 0 || visitAddresses.Clases.Count == 0)
            {
                return NotFound(new { error = "No se encontraron datos de catálogos para los dropdowns de Domicilios." });
            }

            return Ok(visitAddresses);

        }

        [HttpGet("search-postal-code")]
        [AllowAnonymous]
        public async Task<ActionResult<List<CodigosPostales>>> FindPostalCode([FromQuery] int codigoPostal)
        {
            var postalCode = await _searchService.FindPostalCodeInfo(codigoPostal);
            if (postalCode == null)
            {
                return NotFound(new { mensaje = "No se encontró información relacionada a ese código postal." });
            }
            return Ok(new { codigosPostales = postalCode });
        }

        [HttpPost("update-address-information")]
        public async Task<ActionResult<string>> UpdateAddressInformation([FromBody] UpdateAddressInfoRequest domicilioInfo)
        {
            var result = await _searchService.UpdateAddressInfo(domicilioInfo);
            if (!result.Item2)
            {
                return BadRequest(new { message = result.Item1, success = result.Item2 });
            }
            return Ok(new { message = result.Item1, success = result.Item2 });
        }

        [HttpPost("update-address-class")]
        public async Task<ActionResult<string>> UpdateAddressClass([FromBody] UpdateAddressClassRequest domicilioClass)
        {
            var result = await _searchService.UpdateAddressClass(domicilioClass);
            if (!result.Item2)
            {
                return BadRequest(new { message = result.Item1, success = result.Item2 });
            }
            return Ok(new { message = result.Item1, success = result.Item2 });
        }

        [HttpPut("save-new-address")]
        public async Task<ActionResult> SaveNewAddress([FromBody] NewAddressRequest newAddressData)
        {
            var newAddress = await _searchService.SaveNewAddress(newAddressData);
            if (!newAddress.Item3)
            {
                return BadRequest(new { NewAddressInfo = newAddress.Item1, Message = newAddress.Item2, Success = newAddress.Item3 });
            }

            return Ok(new { NewAddressInfo = newAddress.Item1, Message = newAddress.Item2, Success = newAddress.Item3 });
        }



        #endregion

        [HttpGet("conversacion")]
        public async Task<IActionResult> GetConversacion([FromQuery] string idCuenta, string correo)
        {
            var conversacionData = await _searchService.GetConversacionData(idCuenta, correo);
            return Ok(conversacionData);
        }


    }
}