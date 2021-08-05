using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class CreateTeamDto
    {
        public int ColorId { get; set; }
        public int GoalkeeperColorId { get; set; }
        public bool IsGoalEmpty { get; set; }
        public int NumberOfPlayers { get; set; }
        public List<CreatePlayerDto> Players { get; set; }
    }
}
