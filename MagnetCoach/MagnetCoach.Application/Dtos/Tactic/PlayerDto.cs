using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class PlayerDto
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public PositionDto Position { get; set; }
    }
}
