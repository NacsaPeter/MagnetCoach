export interface IRegisterUserDto {
    userName: string;
    name: string;
    email: string;
    password: string;
    birthDay: Date;
}

export interface ILoginUserDto {
    userName: string;
    password: string;
}
