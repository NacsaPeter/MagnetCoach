using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Sport
{
    public class FormationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> Lines { get; set; }
    }
}
