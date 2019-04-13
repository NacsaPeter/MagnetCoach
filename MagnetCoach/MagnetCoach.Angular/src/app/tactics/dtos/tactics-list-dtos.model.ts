export interface IUserTacticListDto {
    userId: number;
    userName: string;
    userTactics: IUserTacticListItemDto[];
}

export interface IUserTacticListItemDto {
    tacticId: number;
    tacticName: string;
    sport: string;
    arenaPart: string;
    ownPlayers: number;
    opponentPlayers: number;
    hasEmptyGoal: boolean;
    isEmptyGoal: boolean;
}
