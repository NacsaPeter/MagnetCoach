export interface ISportsDto {
    colors: IColorDto[];
    sports: ISportDetailsDto[];
}

export interface IColorDto {
    id: number;
    primaryColor: string;
    secondaryColor: string;
}

export interface ISportDetailsDto {
    id: number;
    name: string;
    maxPlayers: number;
    hasGoalkeeper: boolean;
    hasEmptyGoal: boolean;
    formations: IFormationDto[];
}

export interface IFormationDto {
    id: number;
    name: string;
    lines: number[];
}
