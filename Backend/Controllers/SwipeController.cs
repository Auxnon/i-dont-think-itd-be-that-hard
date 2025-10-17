using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SwipeController : ControllerBase
{
    private readonly AppDbContext _context;
    private const int MAX_SWIPES_PER_DAY = 16;

    public SwipeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("profiles/{userId}")]
    public async Task<ActionResult<List<UserProfileDto>>> GetProfiles(int userId)
    {
        // Get users that haven't been swiped by current user yet
        var swipedUserIds = await _context.Swipes
            .Where(s => s.SwiperId == userId)
            .Select(s => s.SwipedUserId)
            .ToListAsync();

        var profiles = await _context.Users
            .Where(u => u.Id != userId && !swipedUserIds.Contains(u.Id))
            .Select(u => new UserProfileDto
            {
                Id = u.Id,
                Name = u.Name,
                PhotoUrl = u.PhotoUrl,
                Bio = u.Bio,
                Age = u.Age
            })
            .Take(50)
            .ToListAsync();

        return Ok(profiles);
    }

    [HttpPost("swipe/{userId}")]
    public async Task<ActionResult<SwipeLimitResponse>> Swipe(int userId, [FromBody] SwipeRequest request)
    {
        // Check daily swipe limit
        var today = DateTime.UtcNow.Date;
        var swipesToday = await _context.Swipes
            .Where(s => s.SwiperId == userId && s.CreatedAt.Date == today)
            .CountAsync();

        if (swipesToday >= MAX_SWIPES_PER_DAY)
        {
            var nextReset = today.AddDays(1);
            return BadRequest(new
            {
                error = "Daily swipe limit reached",
                swipesUsedToday = swipesToday,
                swipesRemaining = 0,
                nextResetTime = nextReset
            });
        }

        // Create the swipe
        var swipe = new Swipe
        {
            SwiperId = userId,
            SwipedUserId = request.SwipedUserId,
            IsLike = request.IsLike,
            CreatedAt = DateTime.UtcNow
        };

        _context.Swipes.Add(swipe);
        await _context.SaveChangesAsync();

        var swipesRemaining = MAX_SWIPES_PER_DAY - swipesToday - 1;
        var nextResetTime = swipesRemaining > 0 ? (DateTime?)null : today.AddDays(1);

        return Ok(new SwipeLimitResponse
        {
            SwipesUsedToday = swipesToday + 1,
            SwipesRemaining = swipesRemaining,
            NextResetTime = nextResetTime
        });
    }

    [HttpGet("limit/{userId}")]
    public async Task<ActionResult<SwipeLimitResponse>> GetSwipeLimit(int userId)
    {
        var today = DateTime.UtcNow.Date;
        var swipesToday = await _context.Swipes
            .Where(s => s.SwiperId == userId && s.CreatedAt.Date == today)
            .CountAsync();

        var swipesRemaining = Math.Max(0, MAX_SWIPES_PER_DAY - swipesToday);
        var nextResetTime = swipesRemaining > 0 ? (DateTime?)null : today.AddDays(1);

        return Ok(new SwipeLimitResponse
        {
            SwipesUsedToday = swipesToday,
            SwipesRemaining = swipesRemaining,
            NextResetTime = nextResetTime
        });
    }
}
