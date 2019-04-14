using MagnetCoach.Application.Dtos.Sport;
using MagnetCoach.Application.Dtos.Tactic;
using MagnetCoach.Application.Enums;
using MagnetCoach.Application.Interfaces;
using MagnetCoach.Domain.Enums;
using MagnetCoach.Domain.Models;
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

        public async Task CreateTacticAsync(CreateTacticDto dto)
        {
            var tactic = new Tactic
            {
                ArenaPart = dto.ArenaPart == "Endzone" ? ArenaPartEnum.Endzone : ArenaPartEnum.Full,
                Name = dto.Name,
                PlayerSize = dto.PlayerSize,
                SportId = dto.SportId,
                UserId = dto.UserId
            };

            var ball = new Ball
            {
                IsVisible = dto.Ball.IsVisible,
                Size = dto.Ball.Size,
                Position = new Position
                {
                    PositionX = (int)dto.Ball.Position.X,
                    PositionY = (int)dto.Ball.Position.Y
                }
            };

            var ownTeam = new Team
            {
                PlayerColorId = dto.OwnTeam.ColorId,
                GoalKeeperColorId = dto.OwnTeam.GoalkeeperColorId,
                EmptyGoal = dto.OwnTeam.EmptyGoal,
                Players = dto.OwnTeam.Players.Select(x => new Player
                {
                    Number = x.Number,
                    Position = new Position
                    {
                        PositionX = (int)x.Position.X,
                        PositionY = (int)x.Position.Y
                    }
                }).ToList()
            };

            var opponentTeam = new Team
            {
                PlayerColorId = dto.OpponentTeam.ColorId,
                GoalKeeperColorId = dto.OpponentTeam.GoalkeeperColorId,
                EmptyGoal = dto.OpponentTeam.EmptyGoal,
                Players = dto.OpponentTeam.Players.Select(x => new Player
                {
                    Number = x.Number,
                    Position = new Position
                    {
                        PositionX = (int)x.Position.X,
                        PositionY = (int)x.Position.Y
                    }
                }).ToList()
            };

            var frame = new Frame
            {
                Tactic = tactic,
                Ball = ball,
                OwnTeam = ownTeam,
                OpponentTeam = opponentTeam
            };

            context.Frames.Add(frame);
            await context.SaveChangesAsync();
        }

        public async Task<TacticDto> GetTacticAsync(int tacticId)
        {
            var tactic = await context.Tactics
                .Include(x => x.Sport)
                .Where(x => x.Id == tacticId)
                .SingleOrDefaultAsync();

            var frames = await context.Frames
                .Include(x => x.OpponentTeam)
                    .ThenInclude(x => x.Players)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(x => x.PlayerColor)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(x => x.GoalKeeperColor)
                .Include(x => x.OwnTeam)
                    .ThenInclude(x => x.Players)
                .Include(x => x.OwnTeam)
                    .ThenInclude(x => x.PlayerColor)
                .Include(x => x.OwnTeam)
                    .ThenInclude(x => x.GoalKeeperColor)
                .Include(x => x.Ball)
                .Where(x => x.TacticId == tacticId)
                .ToListAsync();

            return new TacticDto
            {
                Id = tactic.Id,
                ArenaPart = tactic.ArenaPart == ArenaPartEnum.Endzone ? "Endzone" : "Full",
                PlayerSize = tactic.PlayerSize,
                SportName = tactic.Sport.Name,
                HasGoalkeeper = tactic.Sport.HasGoalkeeper,
                Frames = frames.Select(x => new FrameDto
                {
                    Id = x.Id,
                    Ball = new BallDto
                    {
                        Id = x.BallId,
                        IsVisible = x.Ball.IsVisible,
                        Size = x.Ball.Size,
                        Position = new PositionDto
                        {
                            X = x.Ball.Position.PositionX,
                            Y = x.Ball.Position.PositionY
                        },
                        Color = new ColorDto
                        {
                            Id = 0,
                            NumberColor = "Black",
                            ShirtColor = "Black"
                        }
                    },
                    OwnTeam = new TeamDto
                    {
                        Id = x.OwnTeamId,
                        EmptyGoal = x.OwnTeam.EmptyGoal,
                        Color = new ColorDto
                        {
                            Id = x.OwnTeam.PlayerColor.Id,
                            NumberColor = x.OwnTeam.PlayerColor.NumberColor,
                            ShirtColor = x.OwnTeam.PlayerColor.ShirtColor
                        },
                        GoalkeeperColor = new ColorDto
                        {
                            Id = x.OwnTeam.GoalKeeperColor.Id,
                            NumberColor = x.OwnTeam.GoalKeeperColor.NumberColor,
                            ShirtColor = x.OwnTeam.GoalKeeperColor.ShirtColor
                        },
                        Players = x.OwnTeam.Players.Select(y => new PlayerDto
                        {
                            Id = y.Id,
                            Number = y.Number,
                            Position = new PositionDto
                            {
                                X = y.Position.PositionX,
                                Y = y.Position.PositionY
                            }
                        }).ToList()
                    },
                    OpponentTeam = new TeamDto
                    {
                        Id = x.OpponentTeam.Id,
                        EmptyGoal = x.OpponentTeam.EmptyGoal,
                        Color = new ColorDto
                        {
                            Id = x.OpponentTeam.PlayerColor.Id,
                            NumberColor = x.OpponentTeam.PlayerColor.NumberColor,
                            ShirtColor = x.OpponentTeam.PlayerColor.ShirtColor
                        },
                        GoalkeeperColor = new ColorDto
                        {
                            Id = x.OpponentTeam.GoalKeeperColor.Id,
                            NumberColor = x.OpponentTeam.GoalKeeperColor.NumberColor,
                            ShirtColor = x.OpponentTeam.GoalKeeperColor.ShirtColor
                        },
                        Players = x.OpponentTeam.Players.Select(y => new PlayerDto
                        {
                            Id = y.Id,
                            Number = y.Number,
                            Position = new PositionDto
                            {
                                X = y.Position.PositionX,
                                Y = y.Position.PositionY
                            }
                        }).ToList()
                    }
                }).ToList()
            };
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
