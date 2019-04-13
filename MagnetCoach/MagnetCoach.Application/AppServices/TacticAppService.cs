using MagnetCoach.Application.Dtos.Tactic;
using MagnetCoach.Application.Enums;
using MagnetCoach.Application.Interfaces;
using MagnetCoach.EF;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagnetCoach.Application.AppServices
{
    public class TacticAppService : ITacticAppService
    {
        private readonly ApplicationDbContext context;

        public TacticAppService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<UserTacticListDto> GetTacticsAsync(int userId)
        {
            var user = context.Users
                .Where(x => x.Id == userId)
                .SingleOrDefault();

            var tactics = await context.Tactics
                .Include(x => x.Sport)
                .Include(x => x.Frames)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return new UserTacticListDto
            {
                UserId = user.Id,
                UserName = user.Name,
                UserTactics = tactics.Select(x => new UserTacticListItemDto
                {
                    // ArenaPart = (ArenaPartTypeEnum)Enum.Parse(typeof(ArenaPartTypeEnum), x.ArenaPart.ToString()),
                    ArenaPart = x.ArenaPart.ToString(),
                    Sport = x.Sport.Name,
                    TacticId = x.Id,
                    TacticName = x.Name
                }
                ).ToList()
            };
        }
    }
}
