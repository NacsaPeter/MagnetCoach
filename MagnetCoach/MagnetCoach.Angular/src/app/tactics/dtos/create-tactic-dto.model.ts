export interface ICreateTacticDto {
    userId: number;
    name: string;
    sportId: number;
    arenaPart: string;
    playerSize: number;
    ball: ICreateBallDto;
    ownTeam: ICreateTeamDto;
    opponentTeam: ICreateTeamDto;
}

export interface ICreateBallDto {
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
    isGoalEmpty: boolean;
    numberOfPlayers: number;
    players: ICreatePlayerDto[];
}

export interface ICreatePlayerDto {
    number: number;
    position: IPositionDto;
}
