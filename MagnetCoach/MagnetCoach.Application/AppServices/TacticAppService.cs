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
                UserId = dto.UserId,
                Ball = new ExistingBall
                {
                    IsVisible = dto.Ball.IsVisible,
                    Size = dto.Ball.Size,
                    ColorId = dto.Ball.ColorId
                }
            };

            var frame = new Frame
            {
                Order = 1,
                Tactic = tactic
            };

            if (dto.Ball.IsVisible)
            {
                var firstFrameBall = new Ball
                {
                    Core = tactic.Ball,
                    Position = new Position
                    {
                        X = dto.Ball.Position.X,
                        Y = dto.Ball.Position.Y
                    }
                };

                frame.Ball = firstFrameBall;
            }

            var ownTeam = new Team
            {
                PlayerColorId = dto.OwnTeam.ColorId,
                GoalKeeperColorId = dto.OwnTeam.GoalkeeperColorId,
                IsGoalEmpty = dto.OwnTeam.IsGoalEmpty,
                NumberOfPlayers = dto.OwnTeam.NumberOfPlayers,
            };

            for (int i = 0; i < dto.OwnTeam.NumberOfPlayers; i++)
            {
                var player = new ExistingPlayer
                {
                    Team = ownTeam,
                    Number = dto.OwnTeam.Players[i].Number
                };

                var firtsFramePlayer = new Player
                {
                    Core = player,
                    Frame = frame,
                    Position = new Position
                    {
                        X = dto.OwnTeam.Players[i].Position.X,
                        Y = dto.OwnTeam.Players[i].Position.Y
                    }
                };
            }

            var opponentTeam = new Team
            {
                PlayerColorId = dto.OpponentTeam.ColorId,
                GoalKeeperColorId = dto.OpponentTeam.GoalkeeperColorId,
                IsGoalEmpty = dto.OpponentTeam.IsGoalEmpty,
                NumberOfPlayers = dto.OpponentTeam.NumberOfPlayers,
            };

            for (int i = 0; i < dto.OpponentTeam.NumberOfPlayers; i++)
            {
                var player = new ExistingPlayer
                {
                    Team = opponentTeam,
                    Number = dto.OpponentTeam.Players[i].Number
                };

                var firtsFramePlayer = new Player
                {
                    Core = player,
                    Frame = frame,
                    Position = new Position
                    {
                        X = dto.OpponentTeam.Players[i].Position.X,
                        Y = dto.OpponentTeam.Players[i].Position.Y
                    }
                };
            }

            context.Tactics.Add(tactic);
            await context.SaveChangesAsync();
        }

        public async Task DeleteFrameAsync(int frameId)
        {
            var frame = await context.Frames
                .Include(x => x.Ball)
                .Include(x => x.Players)
                .Where(x => x.Id == frameId)
                .SingleOrDefaultAsync();

            context.Balls.Remove(frame.Ball);
            context.Players.RemoveRange(frame.Players);
            context.Frames.Remove(frame);

            await context.SaveChangesAsync();
        }

        public async Task DeleteTacticAsync(int tacticId)
        {
            var tactic = await context.Tactics
                .Include(x => x.Ball)
                    .ThenInclude(y => y.Balls)
                .Include(x => x.OwnTeam)
                    .ThenInclude(y => y.Players)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(y => y.Players)
                .Include(x => x.Frames)
                .Where(x => x.Id == tacticId)
                .SingleOrDefaultAsync();

            context.Balls.RemoveRange(tactic.Ball.Balls);
            context.ExistingBalls.Remove(tactic.Ball);

            foreach (var frame in tactic.Frames)
            {
                var players = await context.Players
                    .Where(x => x.FrameId == frame.Id)
                    .ToListAsync();
                context.Players.RemoveRange(players);
            }

            context.ExistingPlayers.RemoveRange(tactic.OwnTeam.Players);
            context.Teams.Remove(tactic.OwnTeam);
            context.ExistingPlayers.RemoveRange(tactic.OpponentTeam.Players);
            context.Teams.Remove(tactic.OpponentTeam);

            context.Frames.RemoveRange(tactic.Frames);
            context.Tactics.Remove(tactic);

            await context.SaveChangesAsync();
        }

        public async Task<TacticDto> GetTacticAsync(int userId, int tacticId)
        {
            var tactic = await context.Tactics
                .Include(x => x.Sport)
                .Include(x => x.Ball)
                    .ThenInclude(y => y.Color)
                .Include(x => x.OwnTeam)
                    .ThenInclude(y => y.PlayerColor)
                .Include(x => x.OwnTeam)
                    .ThenInclude(y => y.GoalKeeperColor)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(y => y.PlayerColor)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(y => y.GoalKeeperColor)
                .Where(x => x.Id == tacticId && x.UserId == userId)
                .SingleOrDefaultAsync();

            var frames = await context.Frames
                .Include(x => x.Ball)
                    .ThenInclude(y => y.Position)
                .OrderBy(x => x.Order)
                .Where(x => x.TacticId == tacticId)
                .ToListAsync();

            var dto = new TacticDto
            {
                Id = tactic.Id,
                SportName = tactic.Sport.Name,
                HasGoalkeeper = tactic.Sport.HasGoalkeeper,
                ArenaPart = tactic.ArenaPart,
                PlayerSize = tactic.PlayerSize,
                Ball = new BallDto
                {
                    Id = tactic.Ball.Id,
                    IsVisible = tactic.Ball.IsVisible,
                    Color =  tactic.Ball.Color.PrimaryColor,
                    Size = tactic.Ball.Size
                },
                OwnTeam = CreateTeamDto(tactic.OwnTeam),
                OpponentTeam = CreateTeamDto(tactic.OpponentTeam),
                Frames = new List<FrameDto>()
            };

            foreach (var frame in frames)
            {
                var ownTeamPlayers = await CreatePlayerDtoListAsync(frame.Id, tactic.OwnTeamId);
                var opponentTeamPlayers = await CreatePlayerDtoListAsync(frame.Id, tactic.OpponentTeamId);

                dto.Frames.Add(new FrameDto
                {
                    Id = frame.Id,
                    Details = frame.Details,
                    BallPosition = new PositionDto
                    {
                        X = frame.Ball.Position.X,
                        Y = frame.Ball.Position.Y
                    },
                    OwnTeamPlayers = ownTeamPlayers,
                    OpponentTeamPlayers = opponentTeamPlayers
                });
            }

            return dto;
        }

        private ColorDto CreateColorDto(Color color)
        {
            return new ColorDto
            {
                Id = color.Id,
                PrimaryColor = color.PrimaryColor,
                SecondaryColor = color.SecondaryColor
            };
        }

        private TeamDto CreateTeamDto(Team team)
        {
            return new TeamDto
            {
                Id = team.Id,
                Color = CreateColorDto(team.PlayerColor),
                GoalkeeperColor = CreateColorDto(team.GoalKeeperColor),
                IsGoalEmpty = team.IsGoalEmpty,
                NumberOfPlayers = team.NumberOfPlayers
            };
        }

        private async Task<List<PlayerDto>> CreatePlayerDtoListAsync(int frameId, int teamId)
        {
            return await context.Players
                .Include(x => x.Core)
                .Include(x => x.Position)
                .Where(x => x.FrameId == frameId && x.Core.TeamId == teamId)
                .Select(x => new PlayerDto
                {
                    Id = x.Id,
                    Number = x.Core.Number,
                    Position = new PositionDto
                    {
                        X = x.Position.X,
                        Y = x.Position.Y,
                    }
                })
                .ToListAsync();
        }

        public async Task<List<UserTacticListItemDto>> GetTacticsAsync(int userId)
        {
            var user = context.Users
                .Where(x => x.Id == userId)
                .SingleOrDefault();

            return await context.Tactics
                .Include(x => x.Sport)
                .Include(x => x.OwnTeam)
                    .ThenInclude(y => y.Players)
                .Include(x => x.OpponentTeam)
                    .ThenInclude(y => y.Players)
                .Where(x => x.UserId == userId)
                .Select(x => new UserTacticListItemDto
                {
                    OwnPlayers = x.OwnTeam.Players.Count,
                    OpponentPlayers = x.OpponentTeam.Players.Count,
                    IsGoalEmpty = x.OwnTeam.IsGoalEmpty && x.OpponentTeam.IsGoalEmpty,
                    ArenaPart = x.ArenaPart,
                    Sport = x.Sport.Name,
                    TacticId = x.Id,
                    TacticName = x.Name,
                })
                .ToListAsync();
        }

        public async Task SaveTacticAsync(TacticDto dto)
        {
            var tactic = await context.Tactics
                .Include(x => x.Frames)
                .Where(x => x.Id == dto.Id)
                .SingleOrDefaultAsync();

            foreach (var frameDto in dto.Frames)
            {
                if (frameDto.Id == 0)
                {
                    var frame = new Frame
                    {
                        Order = dto.Frames.IndexOf(frameDto) + 1,
                        Details = frameDto.Details,
                        TacticId = dto.Id,

                        Ball = new Ball
                        {
                            Position = new Position
                            {
                                X = frameDto.BallPosition.X,
                                Y = frameDto.BallPosition.Y
                            },
                            CoreId = tactic.BallId
                        },
                        Players = new List<Player>()
                    };

                    await CreatePlayers(frameDto.OwnTeamPlayers, frame, tactic.OwnTeamId);
                    await CreatePlayers(frameDto.OpponentTeamPlayers, frame, tactic.OpponentTeamId);

                    context.Frames.Add(frame);
                }
                else
                {
                    var frame = tactic.Frames
                        .Where(x => x.Id == frameDto.Id)
                        .SingleOrDefault();

                    frame.Order = dto.Frames.IndexOf(frameDto) + 1;
                    frame.Details = frameDto.Details;

                    var ball = await context.Balls
                        .Include(x => x.Position)
                        .Where(x => x.Id == frame.BallId)
                        .SingleOrDefaultAsync();
                    frame.Ball.Position.X = frameDto.BallPosition.X;
                    frame.Ball.Position.Y = frameDto.BallPosition.Y;

                    await UpdatePlayersPosition(frameDto.OpponentTeamPlayers);
                    await UpdatePlayersPosition(frameDto.OwnTeamPlayers);

                    context.Frames.Update(frame);
                }
            }

            await context.SaveChangesAsync();
        }

        private async Task UpdatePlayersPosition(List<PlayerDto> players)
        {
            foreach (var playerDto in players)
            {
                var player = await context.Players
                    .Include(x => x.Position)
                    .Where(x => x.Id == playerDto.Id)
                    .SingleOrDefaultAsync();
                player.Position.X = playerDto.Position.X;
                player.Position.Y = playerDto.Position.Y;
            }
        }

        private async Task CreatePlayers(List<PlayerDto> players, Frame frame, int teamId)
        {
            foreach (var playerDto in players)
            {
                frame.Players.Add(new Player
                {
                    Position = new Position
                    {
                        X = playerDto.Position.X,
                        Y = playerDto.Position.Y
                    },
                    Core = await context.ExistingPlayers
                        .Where(x => x.Number == playerDto.Number
                                && x.TeamId == teamId)
                        .SingleOrDefaultAsync()
                });
            }
        }
    }
}
