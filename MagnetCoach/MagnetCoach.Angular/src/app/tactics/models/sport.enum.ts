import { IColorViewModel } from './sports.model';

export interface IFormationViewModel {
    id: number;
    name: string;
    lines: number[];
}

export interface ITacticViewModel {
    id: number;
    sportName: string;
    hasGoalkeeper: boolean;
    pitchPart: string;
    playerSize: number;
    frames: IFrameViewModel[];
}

export interface ICreateTacticViewModel {
    id: number;
    name: string;
    sportId: number;
    pitchPart: string;
    playerSize: number;
    frame: IFrameViewModel;
}

export interface IFrameViewModel {
    id: number;
    ball: IBallViewModel;
    ownTeam: ITeamViewModel;
    opponentTeam: ITeamViewModel;
}

export interface ITeamViewModel {
    id: number;
    color: IColorViewModel;
    goalKeeperColor?: IColorViewModel;
    numberOfPlayers: number;
    emptyGoal?: boolean;
    players: IPlayerViewModel[];
}

export interface IPlayerViewModel {
    id: number;
    number: number;
    position: IPositionViewModel;
}

export interface IBallViewModel {
    size: number;
    position: IPositionViewModel;
    visible: boolean;
    color: IColorViewModel;
}

export interface IPositionViewModel {
    x: number;
    y: number;
}
