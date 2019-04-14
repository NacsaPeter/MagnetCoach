using MagnetCoach.Application.Dtos.Sport;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MagnetCoach.Application.Interfaces
{
    public interface ISportAppService
    {
        Task<SportsDto> GetSportsAsync();
    }
}
