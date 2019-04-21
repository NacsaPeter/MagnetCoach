using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Ball : IMagnetTableElement
    {
        public int Id { get; set; }
        public Position Position { get; set; }

        public int Size { get; set; }
        public bool IsVisible { get; set; }

        public int ColorId { get; set; }
        public Color Color { get; set; }
    }
}
