using MagnetCoach.Domain.Models;
using MagnetCoach.EF.Configurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.EF
{
    public class ApplicationDbContext : IdentityDbContext<User, UserRole, int>
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
            builder.Entity<Color>().HasData(new Color { Id = 6, ShirtColor = "White", NumberColor = "Black" });
            builder.Entity<Color>().HasData(new Color { Id = 7, ShirtColor = "Black", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 8, ShirtColor = "Orange", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 9, ShirtColor = "Brown", NumberColor = "White" });
            builder.Entity<Color>().HasData(new Color { Id = 10, ShirtColor = "Pink", NumberColor = "Black" });

            builder.Entity<Sport>().HasData(new Sport {
                Id = 1,
                Name = "Football",
                MaxPlayers = 11,
                HasGoalkeeper = true,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 2,
                Name = "Handball",
                MaxPlayers = 7,
                HasGoalkeeper = true,
                HasEmptyGoal = true
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 3,
                Name = "Basketball",
                MaxPlayers = 5,
                HasGoalkeeper = false,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 4,
                Name = "Ice Hockey",
                MaxPlayers = 6,
                HasGoalkeeper = true,
                HasEmptyGoal = true
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 5,
                Name = "American Football",
                MaxPlayers = 11,
                HasGoalkeeper = false,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 6,
                Name = "Futsal",
                MaxPlayers = 5,
                HasGoalkeeper = true,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 7,
                Name = "Floorball",
                MaxPlayers = 6,
                HasGoalkeeper = true,
                HasEmptyGoal = true
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 8,
                Name = "Rugby",
                MaxPlayers = 15,
                HasGoalkeeper = false,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 9,
                Name = "Waterpolo",
                MaxPlayers = 7,
                HasGoalkeeper = true,
                HasEmptyGoal = false
            });

            builder.Entity<Sport>().HasData(new Sport
            {
                Id = 10,
                Name = "Field Hockey",
                MaxPlayers = 11,
                HasGoalkeeper = true,
                HasEmptyGoal = false
            });
        }
    }
}
