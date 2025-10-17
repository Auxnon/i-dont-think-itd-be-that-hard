using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Swipe> Swipes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Swipe>()
            .HasOne(s => s.Swiper)
            .WithMany(u => u.SwipesMade)
            .HasForeignKey(s => s.SwiperId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Swipe>()
            .HasOne(s => s.SwipedUser)
            .WithMany(u => u.SwipesReceived)
            .HasForeignKey(s => s.SwipedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
