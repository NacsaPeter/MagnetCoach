using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Frame : IDbEntry
    {
        public int Id { get; set; }
        public int Order { get; set; }
        public string Details { get; set; }

        public int TacticId { get; set; }
        public Tactic Tactic { get; set; }

        public int BallId { get; set; }
        public Ball Ball { get; set; }

        public virtual ICollection<Player> Players { get; set; }
    }
}
