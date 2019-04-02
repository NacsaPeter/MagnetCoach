﻿using MagnetCoach.Application.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class UserTacticListItemDto
    {
        public int TacticId { get; set; }
        public string TacticName { get; set; }
        public string Sport { get; set; }
        public ArenaPartTypeEnum ArenaPart { get; set; }
        public int OwnPlayers { get; set; }
        public int OpponentPlayers { get; set; }
        public bool HasEmptyGoal { get; set; }
        public bool IsEmptyGoal { get; set; }
    }
}