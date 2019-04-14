using MagnetCoach.Application.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class CreateTacticDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public int SportId { get; set; }
        public string ArenaPart { get; set; }
        public int PlayerSize { get; set; }

        public CreateBallDto Ball { get; set; }
        public CreateTeamDto OwnTeam { get; set; }
        public CreateTeamDto OpponentTeam { get; set; }
    }
}
