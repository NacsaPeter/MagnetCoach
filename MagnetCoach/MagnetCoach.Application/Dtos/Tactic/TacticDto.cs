using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class TacticDto
    {
        public int Id { get; set; }
        public string SportName { get; set; }
        public bool HasGoalkeeper { get; set; }
        public string ArenaPart { get; set; }
        public int PlayerSize { get; set; }
        public BallDto Ball { get; set; }
        public TeamDto OwnTeam { get; set; }
        public TeamDto OpponentTeam { get; set; }
        public List<FrameDto> Frames { get; set; }
    }
}
