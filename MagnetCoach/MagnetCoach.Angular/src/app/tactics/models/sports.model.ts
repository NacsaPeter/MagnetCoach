export interface ISportsViewModel {
    colors: IColorViewModel[];
    sports: ISportDetailsViewModel[];
}

export interface IColorViewModel {
    id: number;
    shirtColor: string;
    numberColor: string;
}

export interface ISportDetailsViewModel {
    id: number;
    name: string;
    maxPlayers: number;
    hasGoalkeeper: boolean;
    hasEmptyGoal: boolean;
    formations: IFormationViewModel[];
}

export interface IFormationViewModel {
    id: number;
    name: string;
    lines: number[];
}
