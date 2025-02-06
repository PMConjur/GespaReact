namespace NoriAPI.Models.Login
{
    public class AuthRequest
    {
        public string? Usuario { get; set; }
        public string? Contrasenia { get; set; }
        public int? Extension { get; set; }
        public byte? Bloqueo { get; set; }
        public string? Dominio { get; set; }
        public string? Computadora { get; set; }
        public string? UsuarioWindows { get; set; }
        public string? IP { get; set; }
        public string? Aplicacion { get; set; }
        public string? Version { get; set; }

    }
}
