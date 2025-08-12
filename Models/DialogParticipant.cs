namespace DevOpsChatApp.Models
{
    public class DialogParticipant
    {
        public int Id { get; set; }
        public int DialogId { get; set; }
        public Dialog Dialog { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
