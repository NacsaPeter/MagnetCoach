using MagnetCoach.Application.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class TacticCreateDto
    {
        public int UserId { get; set; }
        public int SportId { get; set; }
        public ArenaPartTypeEnum ArenaPart { get; set; }
        public int PlayerSize { get; set; }
        public int OwnTeamColorId { get; set; }
        public int OwnGoalKeeperColorId { get; set; }
        public int OpponentTeamColorId { get; set; }
        public int OpponentGoalKeeperColorId { get; set; }
        public bool OwnEmptyGoal { get; set; }
        public bool OpponentEmptyGoal { get; set; }
        public bool BallVisible { get; set; }
        public int BallSize { get; set; }
    }
}
