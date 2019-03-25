﻿using MagnetCoach.Domain.Models;
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
        }
    }
}