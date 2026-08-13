using System.Text;
using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Application.Interfaces.Services;
using MathTutor.Application.Services;
using MathTutor.Application.Settings;
using MathTutor.Domain.Identity;
using MathTutor.Infrastructure;
using MathTutor.Infrastructure.Data;
using MathTutor.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);


builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();


if (builder.Environment.IsDevelopment())
{
    var dataProtectionKeysPath = Path.Combine(
        builder.Environment.ContentRootPath,
        "DataProtectionKeys");

    builder.Services
        .AddDataProtection()
        .PersistKeysToFileSystem(
            new DirectoryInfo(dataProtectionKeysPath))
        .SetApplicationName("LucidMathTutor");
}



#region Database

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration
        .GetConnectionString("DefaultConnection")));

#endregion




#region Identity

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        // Password Settings
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 8;


        // User Settings
        options.User.RequireUniqueEmail = true;

    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

#endregion





#region JWT Authentication


builder.Services.Configure<JwtSettings>(
    builder.Configuration
    .GetSection("Jwt"));



var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();



builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;


        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;

    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,


                ValidIssuer =
                    jwtSettings!.Issuer,


                ValidAudience =
                    jwtSettings.Audience,


                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.Key))
            };
    });




builder.Services.AddAuthorization();

#endregion





builder.Services.AddHttpClient(
    "LucidAi",
    client =>
    {
        client.Timeout = TimeSpan.FromSeconds(45);
    });


#region Dependency Injection


// Repositories
builder.Services.AddScoped<
    IStudentRepository,
    StudentRepository>();



// Services
builder.Services.AddScoped<
    IStudentService,
    StudentService>();


builder.Services.AddScoped<
    IAuthenticationService,
    AuthenticationService>();


builder.Services.AddScoped<
    IJwtTokenService,
    JwtTokenService>();


builder.Services.AddScoped<ITopicRepository, TopicRepository>();
builder.Services.AddScoped<ITopicService, TopicService>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
#endregion





#region Controllers


builder.Services.AddControllers();


#endregion




#region CORS


builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "ViteFrontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:5174",
                    "http://127.0.0.1:5174")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});


#endregion






var app = builder.Build();






#region Database Seeding


using(var scope = app.Services.CreateScope())
{
    var roleManager =
        scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();


    await DbSeeder.SeedRoles(roleManager);


    if (app.Environment.IsDevelopment())
    {
        var dbContext =
            scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var userManager =
            scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

        await DbSeeder.SeedDevelopmentData(
            dbContext,
            userManager);
    }
}


#endregion







#region Middleware


if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}


app.UseCors("ViteFrontend");


app.UseAuthentication();


app.UseAuthorization();


app.MapControllers();


#endregion







#region API Health Endpoints



app.MapGet("/", async (
    ApplicationDbContext dbContext) =>
{
    try
    {
        var connected =
            await dbContext.Database
            .CanConnectAsync();


        return Results.Ok(new
        {
            Application = "Lucid Math API",

            Version = "1.0.0",

            Status = connected
                ? "Healthy"
                : "Unhealthy",

            Database = connected
                ? "Connected"
                : "Disconnected",

            Time = DateTime.UtcNow
        });

    }
    catch(Exception ex)
    {
        return Results.Problem(
            ex.Message);
    }
});





app.MapGet("/health", async (
    ApplicationDbContext dbContext) =>
{
    try
    {
        var connected =
            await dbContext.Database
            .CanConnectAsync();


        return Results.Ok(new
        {
            status = connected
                ? "Healthy"
                : "Unhealthy",

            database = "PostgreSQL",

            timestamp = DateTime.UtcNow
        });

    }
    catch(Exception ex)
    {
        return Results.Problem(
            ex.Message);
    }
});

#endregion




app.Run();
