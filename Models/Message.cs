using System;

namespace DevOpsChatApp.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; } = null!;

        public int? DialogId { get; set; }
        public Dialog? Dialog { get; set; }

        public string Content { get; set; } = null!;
        public DateTime? Timestamp { get; set; }
    }
}
