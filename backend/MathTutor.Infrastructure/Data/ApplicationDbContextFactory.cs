using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MathTutor.Infrastructure;

public class ApplicationDbContextFactory
    : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var currentDirectory = Directory.GetCurrentDirectory();

        var apiProjectPath = Path.Combine(
            currentDirectory,
            "MathTutor.API");

        if (!Directory.Exists(apiProjectPath))
        {
            apiProjectPath = currentDirectory;
        }

        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiProjectPath)
            .AddJsonFile(
                "appsettings.json",
                optional: false,
                reloadOnChange: false)
            .AddJsonFile(
                "appsettings.Development.json",
                optional: true,
                reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString =
            configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "The DefaultConnection connection string was not found.");
        }

        var optionsBuilder =
            new DbContextOptionsBuilder<ApplicationDbContext>();

        optionsBuilder.UseNpgsql(
            connectionString,
            options =>
                options.MigrationsAssembly(
                    typeof(ApplicationDbContext).Assembly.FullName));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}