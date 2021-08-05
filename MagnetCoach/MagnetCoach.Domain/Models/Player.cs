﻿using MagnetCoach.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Domain.Models
{
    public class Player : IMagnetTableElement
    {
        public int Id { get; set; }
        public Position Position { get; set; }

        public int CoreId { get; set; }
        public ExistingPlayer Core { get; set; }

        public int FrameId { get; set; }
        public Frame Frame { get; set; }
    }
}
