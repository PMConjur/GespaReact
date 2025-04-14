using OktaWeb.Models;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace OktaWeb.Services
{
    public interface IAuthService
    {
        Task<string> Authenticate(LoginRequest loginRequest);
        Task<User> GetUserInfo(string token);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AuthService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<string> Authenticate(LoginRequest loginRequest)
        {
            // Configuración de Okta desde appsettings.json
            var oktaDomain = _configuration["Okta:OktaDomain"];
            var clientId = _configuration["Okta:ClientId"];
            var clientSecret = _configuration["Okta:ClientSecret"];

            // Crear la solicitud para obtener el token
            var tokenEndpoint = $"{oktaDomain}/oauth2/default/v1/token";

            var requestContent = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "password"),
                new KeyValuePair<string, string>("username", loginRequest.Username),
                new KeyValuePair<string, string>("password", loginRequest.Password),
                new KeyValuePair<string, string>("scope", "openid profile email")
            });

            // Autenticación básica con ClientId y ClientSecret
            var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

            // Enviar la solicitud a Okta
            var response = await _httpClient.PostAsync(tokenEndpoint, requestContent);

            if (!response.IsSuccessStatusCode)
            {
                throw new UnauthorizedAccessException("Error al autenticar con Okta");
            }

            // Leer la respuesta y extraer el token
            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<OktaTokenResponse>(responseContent);

            return tokenResponse?.AccessToken ?? throw new Exception("No se pudo obtener el token de Okta");
        }

        public async Task<User> GetUserInfo(string token)
        {
            var oktaDomain = _configuration["Okta:OktaDomain"];
            var userInfoEndpoint = $"{oktaDomain}/oauth2/default/v1/userinfo";

            // Configurar el token en el header
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Obtener información del usuario
            var response = await _httpClient.GetAsync(userInfoEndpoint);

            if (!response.IsSuccessStatusCode)
            {
                throw new UnauthorizedAccessException("Token inválido o expirado");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var userInfo = JsonSerializer.Deserialize<OktaUserInfoResponse>(responseContent);

            return new User
            {
                Id = userInfo?.Sub ?? "unknown",
                Username = userInfo?.PreferredUsername ?? userInfo?.Email,
                Email = userInfo?.Email
            };
        }
    }

    // Clases para deserializar las respuestas de Okta
    public class OktaTokenResponse
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public int ExpiresIn { get; set; }
        public string Scope { get; set; }
    }

    public class OktaUserInfoResponse
    {
        public string Sub { get; set; }  // ID único del usuario
        public string Name { get; set; }
        public string Email { get; set; }
        public string PreferredUsername { get; set; }
    }
}