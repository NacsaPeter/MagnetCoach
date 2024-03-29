﻿using MagnetCoach.Application.Dtos.Sport;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class TeamDto
    {
        public int Id { get; set; }
        public ColorDto Color { get; set; }
        public ColorDto GoalkeeperColor { get; set; }
        public bool IsGoalEmpty { get; set; }
        public int NumberOfPlayers { get; set; }
    }
}
