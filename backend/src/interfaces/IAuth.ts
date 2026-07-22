import { IUserPublic } from "./IUser";

export interface IAuthLoginDTO {
  email: string;
  password: string;
}

export interface IAuthRegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: IUserPublic;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
