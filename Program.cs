using DevOpsChatApp.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
           .EnableSensitiveDataLogging()
           .LogTo(Console.WriteLine, LogLevel.Information));

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        o.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddSignalR();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

// перекидываем корень на auth.html
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/auth.html");
        return;
    }
    await next();
});

app.UseRouting();

app.MapControllers();
app.MapHub<DevOpsChatApp.Hubs.ChatHub>("/chathub");

// Фоллбек: если путь не попал ни в API, ни в статику — отдаём auth.html
app.MapFallbackToFile("/auth.html");

app.Run();
