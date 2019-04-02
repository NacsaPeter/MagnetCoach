export interface ITacticsListViewModel {
    userId: number;
    items: ITacticsListItemViewModel[];
}

export interface ITacticsListItemViewModel {
    id: number;
    name: string;
    sport: string;
    arenaPart: string;
    ownPlayers: number;
    opponentPlayers: number;
    emptyGoal: boolean;
}
