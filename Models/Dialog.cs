using System.Collections.Generic;

namespace DevOpsChatApp.Models
{
    public class Dialog
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<DialogParticipant> Participants { get; set; } = new List<DialogParticipant>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
