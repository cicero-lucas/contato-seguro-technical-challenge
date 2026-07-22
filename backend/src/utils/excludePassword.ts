import { IUser, IUserPublic } from "../interfaces/IUser";

export function excludePassword(user: IUser): IUserPublic {
  const { password: _password, ...userPublic } = user;
  return userPublic;
}
