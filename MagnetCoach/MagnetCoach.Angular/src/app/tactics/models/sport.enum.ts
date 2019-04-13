export enum Sport {
    football,
    basketball,
    handball,
    iceHockey,
    americanFootball,
    futsal,
    floorball,
    rugby,
    waterpolo,
    lawnHockey
}

export enum PitchPart {
    full,
    endzone
}

export interface IFormationViewModel {
    id: number;
    name: string;
    sport: Sport;
    lines: number[];
}

export interface ITacticViewModel {
    id: number;
    sport: Sport;
    pitchPart: PitchPart;
    playerSize: number;
    frames: IFrameViewModel[];
}

export interface IFrameViewModel {
    id: number;
    ball: IBallViewModel;
    ownTeam: ITeamViewModel;
    opponentTeam: ITeamViewModel;
}

export interface ITeamViewModel {
    id: number;
    color: string;
    numberOfPlayers: number;
    emptyGoal?: boolean;
    players: IPlayerViewModel[];
}

export interface IPlayerViewModel {
    id: number;
    position: IPositionViewModel;
}

export interface IBallViewModel {
    size: number;
    position: IPositionViewModel;
    visible: boolean;
}

export interface IPositionViewModel {
    x: number;
    y: number;
}
