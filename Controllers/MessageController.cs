using DevOpsChatApp.Data;
using DevOpsChatApp.Models;
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

        [HttpGet]
        public async Task<IEnumerable<Message>> GetMessage()
        {
            return await _context.Messages
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();
        }

        [HttpGet("user/{username}")]
        public async Task<ActionResult> GetMessageByUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if(user == null) 
                return NotFound($"Пользователь {username} не найден");

            var message = await _context.Messages
                .Where(m => m.UserId == user.Id)
                .OrderByDescending(mbox => mbox.Timestamp)
                .ToListAsync();

            return Ok(message);
        }
    }
}
