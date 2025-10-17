namespace Backend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    public int Age { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string AuthProvider { get; set; } = "email"; // "email" or "google"
    
    public ICollection<Swipe> SwipesMade { get; set; } = new List<Swipe>();
    public ICollection<Swipe> SwipesReceived { get; set; } = new List<Swipe>();
}
