using MagnetCoach.Domain.Models;
using MagnetCoach.EF.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.EF
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Ball> Balls { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Formation> Formations { get; set; }
        public DbSet<FormationLine> FormationLines { get; set; }
        public DbSet<Frame> Frames { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Sport> Sports { get; set; }
        public DbSet<Tactic> Tactics { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new BallConfiguration());
            builder.ApplyConfiguration(new PlayerConfiguration());
            builder.ApplyConfiguration(new SportConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());

            builder.Entity<Color>().HasData(new Color { Id = 1, ShirtColor = "Red", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 2, ShirtColor = "Blue", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 3, ShirtColor = "Green", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 4, ShirtColor = "Yellow", NumberColor = "Black" });
            builder.Entity<Color>().HasData(new Color { Id = 5, ShirtColor = "Purple", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 6, ShirtColor = "Wihte", NumberColor = "Black" });
            builder.Entity<Color>().HasData(new Color { Id = 7, ShirtColor = "Black", NumberColor = "White" });

            builder.Entity<Sport>().HasData(new Sport {
                Id = 1,
                Sports = Domain.Enums.SportsEnum.Football,
                Name = "Football",
                MaxPlayers = 11,
                HasGoalkeeper = true,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 2,
                Sports = Domain.Enums.SportsEnum.Handball,
                Name = "Handball",
                MaxPlayers = 7,
                HasGoalkeeper = true,
                HasEmptyGoal = true
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 3,
                Sports = Domain.Enums.SportsEnum.Basketball,
                Name = "Basketball",
                MaxPlayers = 5,
                HasGoalkeeper = false,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 4,
                Sports = Domain.Enums.SportsEnum.IceHockey,
                Name = "Ice Hockey",
                MaxPlayers = 6,
                HasGoalkeeper = true,
                HasEmptyGoal = true
            });

            builder.Entity<User>().HasData(new User
            {
                Id = 1,
                UserName = "TestUser1",
                Name = "Test User",
                Email = "testuser@test.com",
                PasswordHash = "hash123",
                Salt = "salt123",
                BirthDay = new DateTime()
            });
        }
    }
}
