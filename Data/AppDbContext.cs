using Microsoft.EntityFrameworkCore;
using DevOpsChatApp.Models;
using Microsoft.Extensions.Logging.Abstractions;

namespace DevOpsChatApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Dialog> Dialogs { get; set; } = null!;
        public DbSet<DialogParticipant> DialogsParticipants { get; set; } = null!;
    }

}
