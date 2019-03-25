using MagnetCoach.Domain.Enums;
using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class UserRole : IDbEntry
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public UserRoleEnum Role { get; set; }
    }
}
