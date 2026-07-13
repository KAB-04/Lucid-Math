using Microsoft.EntityFrameworkCore;
using MathTutor.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();


builder.Services.AddDbContext<ApplicationDbContext>(
    options =>
    options.UseNpgsql(
        builder.Configuration
        .GetConnectionString("DefaultConnection")
    )
);


var app = builder.Build();

app.MapControllers();

app.MapGet("/", async (ApplicationDbContext dbContext) =>
{
    try
    {
        var isConnected = await dbContext.Database.CanConnectAsync();
        var html = $$"""
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
            <meta charset=\"utf-8\" />
            <title>MathTutor Database Status</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 2rem; }
                .ok { color: green; }
                .error { color: crimson; }
            </style>
        </head>
        <body>
            <h1>MathTutor Database Status</h1>
            <p class=\"{{(isConnected ? "ok" : "error")}}\">Status: {{(isConnected ? "Connected" : "Disconnected")}}</p>
            <p>Database: PostgreSQL</p>
            <p>Connection string: {{(isConnected ? "Successful" : "Unable to connect")}}</p>
        </body>
        </html>
        """;

        return Results.Content(html, "text/html");
    }
    catch (Exception ex)
    {
        var html = $$"""
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
            <meta charset=\"utf-8\" />
            <title>MathTutor Database Status</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 2rem; }
                .error { color: crimson; }
            </style>
        </head>
        <body>
            <h1>MathTutor Database Status</h1>
            <p class=\"error\">Status: Disconnected</p>
            <p>{{ex.Message}}</p>
        </body>
        </html>
        """;

        return Results.Content(html, "text/html");
    }
});

app.MapGet("/health", async (ApplicationDbContext dbContext) =>
{
    try
    {
        await dbContext.Database.CanConnectAsync();
        return Results.Ok(new { status = "connected", database = "postgres" });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();