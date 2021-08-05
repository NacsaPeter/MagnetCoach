using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class ExistingBall : IDbEntry
    {
        public int Id { get; set; }

        public int Size { get; set; }
        public bool IsVisible { get; set; }

        public int ColorId { get; set; }
        public Color Color { get; set; }

        public virtual ICollection<Ball> Balls { get; set; }
    }
}
