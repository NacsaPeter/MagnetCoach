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
                ArenaPart = dto.ArenaPart,
                Name = dto.Name,
                PlayerSize = dto.PlayerSize,
                SportId = dto.SportId,
                UserId = dto.UserId
            };

            var ball = new Ball
            {
                IsVisible = dto.Ball.IsVisible,
                Size = dto.Ball.Size,
                ColorId = dto.Ball.ColorId,
                Position = new Position
                {
                    PositionX = dto.Ball.Position.X,
                    PositionY = dto.Ball.Position.Y
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
                        PositionX = x.Position.X,
                        PositionY = x.Position.Y
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
                OpponentTeam = opponentTeam,
                Order = 1
            };

            context.Frames.Add(frame);
            await context.SaveChangesAsync();
        }

        public async Task DeleteFrameAsync(int frameId)
        {
            var frame = await context.Frames
                .Include(x => x.Ball)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(x => x.Players)
                .Include(x => x.OwnTeam)
                    .ThenInclude(x => x.Players)
                .Where(x => x.Id == frameId)
                .SingleOrDefaultAsync();

            context.Balls.Remove(frame.Ball);
            context.Players.RemoveRange(frame.OwnTeam.Players);
            context.Players.RemoveRange(frame.OpponentTeam.Players);
            context.Teams.Remove(frame.OwnTeam);
            context.Teams.Remove(frame.OpponentTeam);
            context.Frames.Remove(frame);

            await context.SaveChangesAsync();
        }

        public async Task DeleteTacticAsync(int tacticId)
        {
            var tactic = await context.Tactics
                .Include(x => x.Frames)
                .Where(x => x.Id == tacticId)
                .SingleOrDefaultAsync();

            foreach (var f in tactic.Frames)
            {
                var frame = await context.Frames
                    .Include(x => x.Ball)
                    .Include(x => x.OpponentTeam)
                        .ThenInclude(x => x.Players)
                    .Include(x => x.OwnTeam)
                        .ThenInclude(x => x.Players)
                    .Where(x => x.Id == f.Id)
                    .SingleOrDefaultAsync();

                context.Balls.Remove(frame.Ball);
                context.Players.RemoveRange(frame.OwnTeam.Players);
                context.Players.RemoveRange(frame.OpponentTeam.Players);
                context.Teams.Remove(frame.OwnTeam);
                context.Teams.Remove(frame.OpponentTeam);
            }

            context.Frames.RemoveRange(tactic.Frames);
            context.Tactics.Remove(tactic);

            await context.SaveChangesAsync();
        }

        public async Task<TacticDto> GetTacticAsync(int userId, int tacticId)
        {
            var tactic = await context.Tactics
                .Include(x => x.Sport)
                .Where(x => x.Id == tacticId && x.UserId == userId)
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
                    .ThenInclude(x => x.Color)
                .Where(x => x.TacticId == tacticId)
                .ToListAsync();

            return new TacticDto
            {
                Id = tactic.Id,
                ArenaPart = tactic.ArenaPart,
                PlayerSize = tactic.PlayerSize,
                SportName = tactic.Sport.Name,
                HasGoalkeeper = tactic.Sport.HasGoalkeeper,
                Frames = frames
                    .OrderBy(x => x.Order)
                    .Select(x => new FrameDto
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
                                Id = x.Ball.ColorId,
                                ShirtColor = x.Ball.Color.ShirtColor,
                                NumberColor = x.Ball.Color.NumberColor
                            }
                        },
                        OwnTeam = new TeamDto
                        {
                            Id = x.OwnTeamId ?? 0,
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

            var userTactics = new List<UserTacticListItemDto>();
            foreach (var tactic in tactics)
            {
                var frame = tactic.Frames.First();
                var ownTeam = await context.Teams
                    .Include(x => x.Players)
                    .Where(x => x.Id == frame.OwnTeamId)
                    .SingleOrDefaultAsync();
                var opponentTeam = await context.Teams
                    .Include(x => x.Players)
                    .Where(x => x.Id == frame.OpponentTeamId)
                    .SingleOrDefaultAsync();
                var userTactic = new UserTacticListItemDto
                {
                    OwnPlayers = ownTeam.Players.Count,
                    OpponentPlayers = opponentTeam.Players.Count,
                    IsEmptyGoal = ownTeam.EmptyGoal && opponentTeam.EmptyGoal,
                    ArenaPart = tactic.ArenaPart.ToString(),
                    Sport = tactic.Sport.Name,
                    TacticId = tactic.Id,
                    TacticName = tactic.Name,
                };
                userTactics.Add(userTactic);
            }

            return new UserTacticListDto
            {
                UserId = user.Id,
                UserName = user.Name,
                UserTactics = userTactics
            };
        }

        public async Task<TacticDto> SaveTacticAsync(TacticDto dto)
        {
            var frames = await context.Frames
                .Where(x => x.TacticId == dto.Id)
                .ToListAsync();

            foreach (var frameDto in dto.Frames)
            {
                if (frameDto.Id == 0)
                {
                    var frame = new Frame
                    {
                        Ball = new Ball
                        {
                            ColorId = frameDto.Ball.Color.Id,
                            IsVisible = frameDto.Ball.IsVisible,
                            Size = frameDto.Ball.Size,
                            Position = new Position
                            {
                                PositionX = frameDto.Ball.Position.X,
                                PositionY = frameDto.Ball.Position.Y
                            }
                        },
                        Details = frameDto.Details,
                        OpponentTeam = new Team
                        {
                            EmptyGoal = frameDto.OpponentTeam.EmptyGoal,
                            GoalKeeperColorId = frameDto.OpponentTeam.Color.Id,
                            PlayerColorId = frameDto.OpponentTeam.Color.Id,
                            Players = frameDto.OpponentTeam.Players.Select(x => new Player
                            {
                                Number = x.Number,
                                Position = new Position
                                {
                                    PositionX = x.Position.X,
                                    PositionY = x.Position.Y
                                }
                            }).ToList()
                        },
                        OwnTeam = new Team
                        {
                            EmptyGoal = frameDto.OwnTeam.EmptyGoal,
                            GoalKeeperColorId = frameDto.OwnTeam.Color.Id,
                            PlayerColorId = frameDto.OwnTeam.Color.Id,
                            Players = frameDto.OwnTeam.Players.Select(x => new Player
                            {
                                Number = x.Number,
                                Position = new Position
                                {
                                    PositionX = x.Position.X,
                                    PositionY = x.Position.Y
                                }
                            }).ToList()
                        },
                        Order = frameDto.Order,
                        TacticId = dto.Id
                    };
                    context.Frames.Add(frame);
                }
                else
                {
                    var frame = frames
                        .Where(x => x.Id == frameDto.Id)
                        .SingleOrDefault();

                    var ball = await context.Balls
                        .Include(x => x.Position)
                        .Where(x => x.Id == frame.BallId)
                        .SingleOrDefaultAsync();
                    frame.Ball.Position.PositionX = frameDto.Ball.Position.X;
                    frame.Ball.Position.PositionY = frameDto.Ball.Position.Y;


                    frame.Details = frameDto.Details;
                    frame.Order = frameDto.Order;

                    foreach (var playerDto in frameDto.OpponentTeam.Players)
                    {
                        var player = await context.Players
                            .Include(x => x.Position)
                            .Where(x => x.Id == playerDto.Id)
                            .SingleOrDefaultAsync();
                        player.Position.PositionX = playerDto.Position.X;
                        player.Position.PositionY = playerDto.Position.Y;
                    }

                    foreach (var playerDto in frameDto.OwnTeam.Players)
                    {
                        var player = await context.Players
                            .Include(x => x.Position)
                            .Where(x => x.Id == playerDto.Id)
                            .SingleOrDefaultAsync();
                        player.Position.PositionX = playerDto.Position.X;
                        player.Position.PositionY = playerDto.Position.Y;
                    }
                }
            }

            await context.SaveChangesAsync();

            var tactic = await context.Tactics
                .Include(x => x.Sport)
                .Where(x => x.Id == dto.Id)
                .SingleOrDefaultAsync();

            var newframes = await context.Frames
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
                    .ThenInclude(x => x.Color)
                .Where(x => x.TacticId == tactic.Id)
                .ToListAsync();

            return new TacticDto
            {
                Id = tactic.Id,
                ArenaPart = tactic.ArenaPart,
                PlayerSize = tactic.PlayerSize,
                SportName = tactic.Sport.Name,
                HasGoalkeeper = tactic.Sport.HasGoalkeeper,
                Frames = newframes
                    .OrderBy(x => x.Order)
                    .Select(x => new FrameDto
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
                                Id = x.Ball.ColorId,
                                ShirtColor = x.Ball.Color.ShirtColor,
                                NumberColor = x.Ball.Color.NumberColor
                            }
                        },
                        OwnTeam = new TeamDto
                        {
                            Id = x.OwnTeamId ?? 0,
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
    }
}
