namespace Backend.DTOs;

public class SwipeLimitResponse
{
    public int SwipesUsedToday { get; set; }
    public int SwipesRemaining { get; set; }
    public DateTime? NextResetTime { get; set; }
}
