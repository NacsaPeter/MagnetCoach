using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class User : IdentityUser<int>
    {
        public string Name { get; set; }
        public DateTime BirthDay { get; set; }
        
        public virtual ICollection<Tactic> Tactics { get; set; }
    }
}
