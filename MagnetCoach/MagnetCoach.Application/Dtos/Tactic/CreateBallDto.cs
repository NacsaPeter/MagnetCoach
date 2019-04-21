using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class CreateBallDto
    {
        public bool IsVisible { get; set; }
        public int Size { get; set; }
        public PositionDto Position { get; set; }
        public int ColorId { get; set; }
    }
}
