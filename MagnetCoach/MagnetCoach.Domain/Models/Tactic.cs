using MagnetCoach.Domain.Enums;
using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Tactic : IDbEntry
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int SportId { get; set; }
        public Sport Sport { get; set; }

        public ArenaPartEnum ArenaPart { get; set; }
        public int PlayerSize { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Frame> Frames { get; set; }
    }
}
