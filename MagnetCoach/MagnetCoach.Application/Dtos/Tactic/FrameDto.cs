using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class FrameDto
    {
        public int Id { get; set; }
        public BallDto Ball { get; set; }
        public TeamDto OwnTeam { get; set; }
        public TeamDto OpponentTeam { get; set; }
        public int Order { get; set; }
        public string Details { get; set; }
    }
}
