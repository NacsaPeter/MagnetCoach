﻿using MagnetCoach.Application.Dtos.Tactic;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MagnetCoach.Application.Interfaces
{
    public interface ITacticAppService
    {
        Task<List<UserTacticListItemDto>> GetTacticsAsync(int userId);
        Task CreateTacticAsync(CreateTacticDto dto);
        Task<TacticDto> GetTacticAsync(int userId, int tacticId);
        Task SaveTacticAsync(TacticDto dto);
        Task DeleteTacticAsync(int tacticId);
        Task DeleteFrameAsync(int frameId);
    }
}
