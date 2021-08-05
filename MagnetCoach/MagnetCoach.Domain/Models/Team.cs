using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Team : IDbEntry
    {
        public int Id { get; set; }
        public bool IsGoalEmpty { get; set; }
        public int NumberOfPlayers { get; set; }

        public int? GoalKeeperColorId { get; set; }
        public Color GoalKeeperColor { get; set; }

        public int PlayerColorId { get; set; }
        public Color PlayerColor { get; set; }

        public virtual ICollection<ExistingPlayer> Players { get; set; }
    }
}
