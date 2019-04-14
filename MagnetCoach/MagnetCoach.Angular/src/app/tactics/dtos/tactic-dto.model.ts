import { IPositionDto } from './create-tactic-dto.model';
import { IColorDto } from './sports-dto.model';

export interface ITacticDto {
    id: number;
    sportName: string;
    hasGoalkeeper: boolean;
    arenaPart: string;
    playerSize: number;
    frames: IFrameDto[];
}

export interface IFrameDto {
    id: number;
    ball: IBallDto;
    ownTeam: ITeamDto;
    opponentTeam: ITeamDto;
}

export interface IBallDto {
    id: number;
    isVisible: boolean;
    position: IPositionDto;
    color: IColorDto;
    size: number;
}

export interface ITeamDto {
    id: number;
    color: IColorDto;
    goalkeeperColor: IColorDto;
    emptyGoal: boolean;
    players: IPlayerDto[];
}

export interface IPlayerDto {
    id: number;
    number: number;
    position: IPositionDto;
}
