using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class FrameDto
    {
        public int Id { get; set; }
        public PositionDto BallPosition { get; set; }
        public List<PlayerDto> OwnTeamPlayers { get; set; }
        public List<PlayerDto> OpponentTeamPlayers { get; set; }
        public string Details { get; set; }
    }
}
