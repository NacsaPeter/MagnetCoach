using MagnetCoach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Interfaces
{
    public interface IMagnetTableElement : IDbEntry
    {
        Position Position { get; set; }
    }
}
