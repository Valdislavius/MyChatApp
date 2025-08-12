using System.Collections.Generic;

namespace DevOpsChatApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public ICollection<DialogParticipant> DialogParticipants { get; set; } = new List<DialogParticipant>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
