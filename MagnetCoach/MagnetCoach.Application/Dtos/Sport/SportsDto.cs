using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Sport
{
    public class SportsDto
    {
        public List<ColorDto> Colors { get; set; }
        public List<SportDetailsDto> Sports { get; set; }
    }
}
