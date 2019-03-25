using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class FormationLine : IDbEntry
    {
        public int Id { get; set; }

        public int FormationId { get; set; }
        public Formation Formation { get; set; }

        public int Order { get; set; }
        public int NumberOfPlayers { get; set; }
    }
}
