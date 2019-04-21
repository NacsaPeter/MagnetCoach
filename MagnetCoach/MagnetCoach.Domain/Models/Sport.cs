using MagnetCoach.Domain.Enums;
using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Sport : IDbEntry
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MaxPlayers { get; set; }
        public bool HasGoalkeeper { get; set; }
        public bool HasEmptyGoal { get; set; }

        public virtual ICollection<Formation> Formations { get; set; }
    }
}
