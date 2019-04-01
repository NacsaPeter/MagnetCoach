using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos.Tactic
{
    public class UserTacticListDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public List<UserTacticListItemDto> UserTactics { get; set; }
    }
}
