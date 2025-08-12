using DevOpsChatApp.Data;
using DevOpsChatApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace DevOpsChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        public record UserAuthDto(string Username, string Password);

        // Регистрация
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserAuthDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Имя пользователя и пароль обязательны");

            var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username);
            if (exists)
                return Conflict("Пользователь уже существует");

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Регистрация успешна" });
        }

        // Логин
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserAuthDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Имя пользователя и пароль обязательны");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
                return Unauthorized("Неверные данные");

            var hash = HashPassword(dto.Password);
            if (user.PasswordHash != hash)
                return Unauthorized("Неверные данные");

            return Ok(new { message = "Вход выполнен", username = user.Username });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
