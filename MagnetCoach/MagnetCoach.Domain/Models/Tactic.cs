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

        public string ArenaPart { get; set; }
        public int PlayerSize { get; set; }
        public string Name { get; set; }

        public int BallId { get; set; }
        public ExistingBall Ball { get; set; }

        public int OwnTeamId { get; set; }
        public Team OwnTeam { get; set; }

        public int OpponentTeamId { get; set; }
        public Team OpponentTeam { get; set; }

        public virtual ICollection<Frame> Frames { get; set; }
    }
}
