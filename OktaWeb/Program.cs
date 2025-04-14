using Microsoft.AspNetCore.Authentication.JwtBearer;
using Okta.AspNetCore;
using OktaWeb.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<IAuthService, AuthService>();

// Configuración de autenticación con Okta
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddOktaWebApi(new OktaWebApiOptions()
    {
        OktaDomain = builder.Configuration["Okta:OktaDomain"],
        AuthorizationServerId = builder.Configuration["Okta:AuthorizationServerId"],
        Audience = builder.Configuration["Okta:Audience"]
    });

// Registrar el servicio
builder.Services.AddScoped<IAuthService, AuthService>();

// Configuración CORS (¡Antes de Build()!)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSwagger", builder =>
    {
        builder.WithOrigins("https://localhost:7101") // URL de tu API
               .AllowCredentials() // Permite cookies
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddAuthorization();

var app = builder.Build(); // <- Todo lo que sea servicios debe ir ANTES de esta línea

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSwagger"); // Middleware CORS (esto SÍ va después de Build)

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();