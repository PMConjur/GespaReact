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

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/login")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly string secretKey;
        private readonly string issuer;
        private readonly string audience;
        private readonly DateTime expirationTime;

        public LoginController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;

            secretKey = _configuration["JwtSettings:Key"];
            issuer = _configuration["JwtSettings:Issuer"];
            audience = _configuration["JwtSettings:Audience"];
            expirationTime = DateTime.UtcNow.AddHours(int.Parse(_configuration["JwtSettings:ExpiryHours"] ?? "1"));
        }



        [HttpPost("resetea-password")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoLogin>> ReseteaPassword([FromBody] ReseteaContra request)
        {
            var resetea = await _userService.ValidateContra(request);

            if (!resetea.Mensaje.IsNullOrEmpty())
            {
                return Unauthorized(new { resetea });

            }

            return Ok(new { resetea });

        }


        [HttpPost("iniciar-sesion")]
        public async Task<ActionResult<ResultadoLogin>> Login([FromBody] AuthRequest request)
        {
            var ejecutivo = await _userService.ValidateUser(request);

            if (!ejecutivo.Mensaje.IsNullOrEmpty() || ejecutivo.Expiro == true || ejecutivo.Sesion == true)
            {
                return Unauthorized(new { ejecutivo });
            }

            ejecutivo.Token = GenerateJwtToken(request);

            return Ok(new { ejecutivo });
        }

        private string GenerateJwtToken(AuthRequest user)
        {

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("JWT Secret is not configured.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // TODO: Implement role-based authorization
            //var encargadoUsers = _configuration.GetSection("RoleMappings:EncargadoUsers").Get<List<string>>();
            //var role = encargadoUsers!.Contains(user.Usuario!) ? "Encargado" : "EjecutivoLogin";

            var claims = new List<Claim>
            {
                new (JwtRegisteredClaimNames.Sub, user.Usuario!),
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new ("Usuario", user.Usuario!.ToString()),
                //new (ClaimTypes.Role, role) // Add the role as a claim
            };

            var tokenBody = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expirationTime,
                signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(tokenBody);

            return token;
        }


        //[HttpGet("validate-api-key")]
        //public async Task<IActionResult> ValidateApiKey([FromQuery] string apiKey)
        //{
        //    bool isValid = await _userService.IsValidApiKey(apiKey);

        //    if (!isValid)
        //    {
        //        return Unauthorized(new { message = "Invalid API key" });
        //    }

        //    return Ok(new { message = "API key is valid" });
        //}

    }
}
