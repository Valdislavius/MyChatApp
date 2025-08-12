using DevOpsChatApp.Data;
using DevOpsChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DevOpsChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;

        public ChatHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendMessage(string user, string message)
        {
            // Ищем существующего пользователя
            var userEntity = await _context.Users.FirstOrDefaultAsync(u => u.Username == user);

            // если нет - создаём с дефотным паролем
            if (userEntity == null)
            {
                userEntity = new User
                {
                    Username = user,
                    PasswordHash = HashPassword("0000") // простой временный пароль
                };

                _context.Users.Add(userEntity);
                await _context.SaveChangesAsync();
            }

            //Можно найти/создать общий диалог для всех
            var defaultDialog = await _context.Dialogs.FirstOrDefaultAsync(d => d.Name == "General");
            if (defaultDialog == null)
            {
                defaultDialog = new Dialog { Name = "General" };
                _context.Dialogs.Add(defaultDialog);
                await _context.SaveChangesAsync();
            }

            //Создаём и сохраняем сообещния
            var msg = new Message
            {
                UserId = userEntity.Id,
                DialogId = defaultDialog.Id, // всегда есть теперь
                Content = message,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();

            //Отправляем в UI
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        } 
    }
}