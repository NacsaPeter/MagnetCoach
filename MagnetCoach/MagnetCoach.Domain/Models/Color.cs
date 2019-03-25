using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Color : IDbEntry
    {
        public int Id { get; set; }
        public string ShirtColor { get; set; }
        public string NumberColor { get; set; }
    }
}
