using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Player : IMagnetTableElement
    {
        public int Id { get; set; }
        public Position Position { get; set; }
        public int Number { get; set; }

        public int TeamId { get; set; }
        public Team Team { get; set; }
    }
}
