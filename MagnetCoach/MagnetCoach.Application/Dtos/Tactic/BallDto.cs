using MagnetCoach.Application.Dtos.Sport;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class BallDto
    {
        public int Id { get; set; }
        public bool IsVisible { get; set; }
        public PositionDto Position { get; set; }
        public ColorDto Color { get; set; }
        public int Size { get; set; }
    }
}
