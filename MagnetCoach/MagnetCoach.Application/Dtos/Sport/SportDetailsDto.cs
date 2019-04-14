using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Sport
{
    public class SportDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MaxPlayers { get; set; }
        public bool HasGoalkeeper { get; set; }
        public bool HasEmptyGoal { get; set; }
        public List<FormationDto> Formations { get; set; }
    }
}
