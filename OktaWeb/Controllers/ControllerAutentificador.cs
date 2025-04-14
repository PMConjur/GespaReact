using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OktaWeb.Services;
using OktaWeb.Models;

namespace OktaWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.Authenticate(request);

            // Opción 1: Configurar cookie (segura)
            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(55)
            });

            // Opción 2: Devolver token en la respuesta (solo para desarrollo)
            return Ok(new
            {
                message = "Login exitoso",
                token = token,  // ← Esto expone el token (no recomendado en producción)
                expiresAt = DateTime.UtcNow.AddMinutes(55)
            });
        }


        [HttpGet("me")]
        [Authorize] // Requiere autenticación
        public async Task<IActionResult> GetUserInfo()
        {
            try
            {
                // Obtener el token del header Authorization
                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                var user = await _authService.GetUserInfo(token);
                return Ok(user);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
