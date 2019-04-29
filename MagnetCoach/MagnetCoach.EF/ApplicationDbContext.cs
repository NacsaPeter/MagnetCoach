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


            builder.Entity<Formation>().HasData(new Formation { Id = 1, Name = "4-4-2", SportId = 1 });
            builder.Entity<Formation>().HasData(new Formation { Id = 2, Name = "4-3-3", SportId = 1 });
            builder.Entity<Formation>().HasData(new Formation { Id = 3, Name = "6", SportId = 2 });
            builder.Entity<Formation>().HasData(new Formation { Id = 4, Name = "5-1", SportId = 2 });

            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 1, NumberOfPlayers = 1, Order = 1, FormationId = 1 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 2, NumberOfPlayers = 4, Order = 2, FormationId = 1 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 3, NumberOfPlayers = 4, Order = 3, FormationId = 1 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 4, NumberOfPlayers = 2, Order = 4, FormationId = 1 });

            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 5, NumberOfPlayers = 1, Order = 1, FormationId = 2 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 6, NumberOfPlayers = 4, Order = 2, FormationId = 2 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 7, NumberOfPlayers = 3, Order = 3, FormationId = 2 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 8, NumberOfPlayers = 3, Order = 4, FormationId = 2 });

            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 9, NumberOfPlayers = 1, Order = 1, FormationId = 3 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 10, NumberOfPlayers = 6, Order = 2, FormationId = 3 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 11, NumberOfPlayers = 0, Order = 3, FormationId = 3 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 12, NumberOfPlayers = 0, Order = 4, FormationId = 3 });

            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 13, NumberOfPlayers = 1, Order = 1, FormationId = 4 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 14, NumberOfPlayers = 5, Order = 2, FormationId = 4 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 15, NumberOfPlayers = 1, Order = 3, FormationId = 4 });
            builder.Entity<FormationLine>().HasData(new FormationLine { Id = 16, NumberOfPlayers = 0, Order = 4, FormationId = 4 });
        }
    }
}
