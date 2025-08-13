using DevOpsChatApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevOpsChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        // Получить все сообщения — теперь с именем пользователя и текстом
        [HttpGet]
        public async Task<IEnumerable<object>> GetMessage()
        {
            var messages = await _context.Messages
                .Include(m => m.User) // подгружаем связанные данные о пользователе
                .OrderByDescending(m => m.Timestamp)
                .Select(m => new
                {
                    Id = m.Id,
                    UserName = m.User != null ? m.User.Username : "Unknown",
                    Content = m.Content,
                    Timestamp = m.Timestamp
                })
                .ToListAsync();

            return messages;
        }

        // Получить сообщения конкретного пользователя
        [HttpGet("user/{username}")]
        public async Task<ActionResult> GetMessageByUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return NotFound($"Пользователь {username} не найден");

            var messages = await _context.Messages
                .Where(m => m.UserId == user.Id)
                .OrderByDescending(m => m.Timestamp)
                .Select(m => new
                {
                    Id = m.Id,
                    UserName = user.Username,
                    Content = m.Content,
                    Timestamp = m.Timestamp
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}
