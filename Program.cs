using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NoriAPI.Middleware;
using NoriAPI.Repositories;
using NoriAPI.Services;
using NoriAPI.Swagger; // Asegúrate de incluir este namespace para SwaggerDefaultValues
using System.Linq;
using System.Text;
using static NoriAPI.Services.IEjecutivoService;
using static NoriAPI.Services.ISearchService;

// 👇 Asegúrate de agregar este "using" con el namespace donde está tu SwaggerIgnoreFilter
using NoriAPI.Swagger.Filters;

var builder = WebApplication.CreateBuilder(args);

var additionalIssuers = builder.Configuration.GetSection("JwtSettings:AdditionalIssuers").Exists()
    ? builder.Configuration.GetSection("JwtSettings:AdditionalIssuers").Get<string[]>() ?? []
    : [];

var additionalAudiences = builder.Configuration.GetSection("JwtSettings:AdditionalAudiences").Exists()
    ? builder.Configuration.GetSection("JwtSettings:AdditionalAudiences").Get<string[]>() ?? []
    : [];

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Agregar servicios
builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuers = new[] { builder.Configuration["JwtSettings:Issuer"] }.Concat(additionalIssuers),
        ValidAudiences = new[] { builder.Configuration["JwtSettings:Audience"] }.Concat(additionalAudiences),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
    };
});

builder.Services.AddEndpointsApiExplorer();

// Agregar Swagger con autenticación
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "NoriAPI", Version = "v1" });

    // Configurar Bearer Token
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese el token en el formato: Bearer {su_token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // ✅ PASO 3: Agregamos el filtro para que Swagger ignore propiedades marcadas con [SwaggerIgnore]
    options.SchemaFilter<SwaggerIgnoreFilter>();

    // ✅ Agregar el filtro SwaggerDefaultValues
    options.OperationFilter<SwaggerDefaultValues>(); // Agregado el filtro aquí
});

// Registramos los servicios
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IEjecutivoService, EjecutivoService>();

// Registramos los Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISearchRepository, SearchRepository>();
builder.Services.AddScoped<IEjecutivoRepository, EjecutivoRepository>();
builder.Services.AddScoped<IBusquedaRepository, BusquedaRepository>();

var app = builder.Build();

// Configurar Middleware

// Usar la política CORS antes de los controladores
app.UseCors("PermitirTodo");

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "NoriAPI v1");
    // c.RoutePrefix = string.Empty; // Opcional: muestra Swagger en la raíz
});

app.UseGlobalErrorHandler();
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
