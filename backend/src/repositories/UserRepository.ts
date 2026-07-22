import prisma from "../config/prisma";
import { ICreateUserDTO, IUpdateUserDTO } from "../interfaces/IUser";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: ICreateUserDTO) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: IUpdateUserDTO) {
    return prisma.user.update({ where: { id }, data });
  }
}
