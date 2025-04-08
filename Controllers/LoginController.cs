using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using NoriAPI.Models.Login;
using Microsoft.Extensions.Configuration;
using NoriAPI.Services;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.Text.Json;

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/login")]
    //[Authorize]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly string secretKey;
        private readonly string issuer;
        private readonly string audience;

        public LoginController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;

            secretKey = _configuration["JwtSettings:Key"];
            issuer = _configuration["JwtSettings:Issuer"];
            audience = _configuration["JwtSettings:Audience"];
        }

        [HttpPost("resetea-password")]
        [AllowAnonymous]
        public async Task<ActionResult<ResultadoLogin>> ReseteaPassword([FromBody] ReseteaContra request)
        {
            if (string.IsNullOrEmpty(request.Usuario) || string.IsNullOrEmpty(request.NuevaContra) || string.IsNullOrEmpty(request.Contra))
            {
                return BadRequest(new { Mensaje = "Todos los campos son obligatorios." });
            }

            var resetea = await _userService.ValidateContra(request);

            if (!string.IsNullOrEmpty(resetea.Mensaje))
            {
                return BadRequest(new { resetea });
            }

            return Ok(new { resetea });
        }

        [HttpPost("iniciar-sesion")]
        [AllowAnonymous]
        public async Task<ActionResult<ResultadoLogin>> Login([FromBody] AuthRequest request)
        {
            // Capture the client's IP address from the HttpContext
            string? clientIP = HttpContext.Connection.RemoteIpAddress?.ToString();

            // Update the request object with the server-determined IP
            request.IP = clientIP;

            var ejecutivo = await _userService.ValidateUser(request);

            if (!string.IsNullOrEmpty(ejecutivo.Mensaje) || ejecutivo.Expiro == true || ejecutivo.Sesion == true)
            {
                return Ok(new { ejecutivo });
            }
            else
            {
                ejecutivo.Token = GenerateJwtToken(request);
                return Ok(new { ejecutivo });
            }

        }


        /**
        Renew Token Method Diseñado por Yoshi
        */


        [HttpPost("renew-token")]
        //[ProducesResponseType(typeof(RenewTokenResult), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RenewToken([FromBody] RenewTokenRequest renewTokenInfo)
        {
            (string, bool) validationResult = await _userService.ValidateUserForRefresh(renewTokenInfo);

            if (!validationResult.Item2)
            {
                return BadRequest(new { token = "", mensaje = validationResult.Item1 });
            }

            string newToken = GenerateJwtToken(new AuthRequest { Usuario = renewTokenInfo.Usuario });

            return Ok(new { token = newToken, mensaje = "Éxito" });
        }

        /*Cierre de sesion C#*/

        [HttpGet("cierre-sesion")]
        public async Task<IActionResult> GetCierreSesion(int idEjecutivo, int idLogIngreso)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable CierreSesion = new DataTable();

                CierreSesion = await _userService.GetCierreSesion(idEjecutivo, idLogIngreso);

                // Convertimos el DataTable a una lista de diccionarios
                var listaCierre = ConvertDataTableToList(CierreSesion);

                // Serializamos la lista a JSON
                string jsonCierre = JsonSerializer.Serialize(listaCierre, new JsonSerializerOptions { WriteIndented = true });


                /*------------------------------------------------------------------------*/

                DataTable CierreLog = new DataTable();

                CierreLog = await _userService.GetCierreLog(idLogIngreso);

                // Convertimos el DataTable a una lista de diccionarios
                var listaCierreLog = ConvertDataTableToList(CierreLog);

                // Serializamos la lista a JSON
                string jsonCierreLog = JsonSerializer.Serialize(listaCierreLog, new JsonSerializerOptions { WriteIndented = true });

                //return Ok(jsonNegociaciones);
                return Content(jsonCierreLog, "application/json; charset=utf-8");


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }




        private string GenerateJwtToken(AuthRequest user)
        {
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("JWT Secret is not configured.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var secureId = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
                {
                    new (JwtRegisteredClaimNames.Sub, user.Usuario!),
                    new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new ("Usuario", user.Usuario!.ToString())
                };

            var tokenBody = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(int.Parse(_configuration["JwtSettings:ExpiryHours"] ?? "1")),
                signingCredentials: secureId);

            var token = new JwtSecurityTokenHandler().WriteToken(tokenBody);

            return token;
        }

        #region Directorio
        private List<Dictionary<string, object>> ConvertDataTableToList(DataTable dataTable)
        {
            var list = new List<Dictionary<string, object>>();

            foreach (DataRow row in dataTable.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn column in dataTable.Columns)
                {
                    dict[column.ColumnName] = row[column];
                }
                list.Add(dict);
            }

            return list;
        }

        #endregion
    }
}
