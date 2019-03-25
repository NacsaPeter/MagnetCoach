using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class User : IDbEntry
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public DateTime BirthDay { get; set; }

        public virtual ICollection<UserRole> Roles { get; set; }
        public virtual ICollection<Tactic> Tactics { get; set; }
    }
}
