import { IPositionDto } from './create-tactic-dto.model';
import { IColorDto } from './sports-dto.model';

export interface ITacticDto {
    id: number;
    sportName: string;
    hasGoalkeeper: boolean;
    arenaPart: string;
    playerSize: number;
    ball: IBallDto;
    ownTeam: ITeamDto;
    opponentTeam: ITeamDto;
    frames: IFrameDto[];
}

export interface IFrameDto {
    id: number;
    ballPosition: IPositionDto;
    ownTeam: IPlayerDto[];
    opponentTeam: IPlayerDto[];
    details?: string;
}

export interface IBallDto {
    id: number;
    isVisible: boolean;
    color: string;
    size: number;
}

export interface ITeamDto {
    id: number;
    color: IColorDto;
    goalkeeperColor: IColorDto;
    isGoalEmpty: boolean;
    numberOfPlayers: number;
}

export interface IPlayerDto {
    id: number;
    number: number;
    position: IPositionDto;
}
