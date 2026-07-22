export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
}
