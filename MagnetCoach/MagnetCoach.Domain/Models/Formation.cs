using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Formation : IDbEntry
    {
        public int Id { get; set; }

        public int SportId { get; set; }
        public Sport Sport { get; set; }

        public string Name { get; set; }

        public virtual ICollection<FormationLine> Lines { get; set; }
    }
}
