using MagnetCoach.Application.Dtos.Tactic;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MagnetCoach.Application.Interfaces
{
    public interface ITacticAppService
    {
        Task<UserTacticListDto> GetTacticsAsync(int userId);
        Task CreateTacticAsync(CreateTacticDto dto);
        Task<TacticDto> GetTacticAsync(int tacticId);
    }
}
