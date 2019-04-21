export interface IRegisterUserDto {
    userName: string;
    firstName: string;
    lastName: string;
    prefix: string;
    email: string;
    password: string;
    birthDay: Date;
}

export interface ILoginUserDto {
    userName: string;
    password: string;
}
