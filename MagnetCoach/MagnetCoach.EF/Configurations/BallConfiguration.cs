using MagnetCoach.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.EF.Configurations
{
    public class BallConfiguration : IEntityTypeConfiguration<Ball>
    {
        public void Configure(EntityTypeBuilder<Ball> builder)
        {
            builder.OwnsOne(x => x.Position);
        }
    }
}
