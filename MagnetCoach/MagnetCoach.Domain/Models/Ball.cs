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

        public int CoreId { get; set; }
        public ExistingBall Core { get; set; }
    }
}
