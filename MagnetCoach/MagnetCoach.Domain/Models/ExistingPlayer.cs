using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class ExistingPlayer : IDbEntry
    {
        public int Id { get; set; }
        public int Number { get; set; }

        public int TeamId { get; set; }
        public Team Team { get; set; }

        public virtual ICollection<Player> Players { get; set; }
    }
}
