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
using Microsoft.AspNetCore.Http;

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
            var ejecutivo = await _userService.ValidateUser(request);

            if (!string.IsNullOrEmpty(ejecutivo.Mensaje) || ejecutivo.Expiro == true || ejecutivo.Sesion == true)
            {
                return Ok(new { ejecutivo });
            }

            ejecutivo.Token = GenerateJwtToken(request);

            return Ok(new { ejecutivo });
        }

        [HttpPost("renew-token")]
        //[ProducesResponseType(typeof(RenewTokenResult), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RenewToken([FromBody]  string contrasenia)
        {
            return Ok(new RenewTokenResult { });
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
    }
}
