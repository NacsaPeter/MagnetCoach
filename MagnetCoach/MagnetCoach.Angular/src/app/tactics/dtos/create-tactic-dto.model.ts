export interface ICreateTacticDto {
    userId: number;
    name: string;
    sportId: number;
    arenaPart: string;
    playerSize: number;
    ball: ICreateBallTacticDto;
    ownTeam: ICreateTeamDto;
    opponentTeam: ICreateTeamDto;
}

export interface ICreateBallTacticDto {
    isVisible: boolean;
    size: number;
    position: IPositionDto;
    colorId: number;
}

export interface IPositionDto {
    x: number;
    y: number;
}

export interface ICreateTeamDto {
    colorId: number;
    goalkeeperColorId: number;
    emptyGoal: boolean;
    players: ICreatePlayerDto[];
}

export interface ICreatePlayerDto {
    number: number;
    position: IPositionDto;
}
