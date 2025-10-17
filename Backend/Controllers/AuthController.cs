using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            user = new User
            {
                Email = request.Email,
                Name = request.Name,
                PhotoUrl = request.PhotoUrl,
                AuthProvider = request.AuthProvider,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return Ok(user);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<User>> GetUser(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPut("user/{userId}")]
    public async Task<ActionResult<User>> UpdateUser(int userId, [FromBody] UserProfileDto profile)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.Name = profile.Name;
        user.Bio = profile.Bio;
        user.Age = profile.Age;
        user.PhotoUrl = profile.PhotoUrl;

        await _context.SaveChangesAsync();
        return Ok(user);
    }
}
