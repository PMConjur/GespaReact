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
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public LoginController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }


        [HttpPost("iniciar-sesion")]
        public async Task<ActionResult<ResultadoLogin>> Login([FromBody] AuthRequest request)
        {
            var ejecutivo = await _userService.ValidateUser(request);

            if (ejecutivo == null)
            {
                return Unauthorized(new { ejecutivo });
            }

            return Ok(new { ejecutivo });
        }

        //private string GenerateJwtToken(AuthRequest user)
        //{
        //    var secretKey = _configuration["JwtSettings:Secret"];
        //    if (string.IsNullOrEmpty(secretKey))
        //    {
        //        throw new InvalidOperationException("JWT Secret is not configured.");
        //    }
        //    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        //    var encargadoUsers = _configuration.GetSection("RoleMappings:EncargadoUsers").Get<List<string>>();

        //    var role = encargadoUsers!.Contains(user.Usuario!) ? "Encargado" : "EjecutivoLogin";

        //    var claims = new List<Claim>
        //    {
        //        new (JwtRegisteredClaimNames.Sub, user.Usuario!),
        //        new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        //        new ("UserID", user.Usuario!.ToString()),
        //        new (ClaimTypes.Role, role) // Add the role as a claim
        //    };

        //    var token = new JwtSecurityToken(
        //        issuer: _configuration["JwtSettings:Issuer"],
        //        audience: _configuration["JwtSettings:Audience"],
        //        claims: claims,
        //        expires: DateTime.UtcNow.AddHours(int.Parse(_configuration["JwtSettings:ExpiryHours"] ?? "1")),
        //        signingCredentials: credentials);

        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}


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
