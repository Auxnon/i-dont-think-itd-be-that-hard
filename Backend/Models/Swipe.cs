namespace Backend.Models;

public class Swipe
{
    public int Id { get; set; }
    public int SwiperId { get; set; }
    public User Swiper { get; set; } = null!;
    public int SwipedUserId { get; set; }
    public User SwipedUser { get; set; } = null!;
    public bool IsLike { get; set; } // true = swipe right (like), false = swipe left (pass)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
