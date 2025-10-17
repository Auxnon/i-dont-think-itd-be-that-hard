namespace Backend.DTOs;

public class UserProfileDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Bio { get; set; }
    public int Age { get; set; }
}
