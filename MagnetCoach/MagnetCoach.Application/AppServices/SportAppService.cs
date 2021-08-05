using MagnetCoach.Application.Dtos.Sport;
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
    public class SportAppService : ISportAppService
    {
        private readonly ApplicationDbContext context;

        public SportAppService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<SportsDto> GetSportsAsync()
        {
            var colors = await context.Colors
                .ToListAsync();

            var sports = await context.Sports
                .ToListAsync();

            var formations = await context.Formations
                .ToListAsync();

            var formationLines = await context.FormationLines
                .ToListAsync();

            return new SportsDto
            {
                Colors = colors.Select(x => new ColorDto
                {
                    Id = x.Id,
                    PrimaryColor = x.PrimaryColor,
                    SecondaryColor = x.SecondaryColor
                }).ToList(),

                Sports = sports.Select(x => new SportDetailsDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    MaxPlayers = x.MaxPlayers,
                    HasGoalkeeper = x.HasGoalkeeper,
                    HasEmptyGoal = x.HasEmptyGoal,
                    Formations = formations
                        .Where(y => y.SportId == x.Id)
                        .Select(y => new FormationDto
                        {
                            Id = y.Id,
                            Name = y.Name,
                            Lines = formationLines
                                .Where(z => z.FormationId == y.Id)
                                .OrderBy(z => z.Order)
                                .Select(z => z.NumberOfPlayers)
                                .ToList()
                        }).ToList()
                }).ToList()
            };
        }
    }
}
