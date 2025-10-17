namespace Backend.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? PhotoUrl { get; set; }
    public string AuthProvider { get; set; } = "email";
}
