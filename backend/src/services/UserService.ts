import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";
import { ICreateUserDTO, IUpdateUserDTO } from "../interfaces/IUser";
import { AppError } from "../utils/AppError";
import { excludePassword } from "../utils/excludePassword";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError("Usuário não encontrado", 404);
    return excludePassword(user);
  }

  async create(data: ICreateUserDTO) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new AppError("E-mail já cadastrado", 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({ ...data, password: hashedPassword });
    return excludePassword(user);
  }

  async update(id: string, data: IUpdateUserDTO) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) throw new AppError("E-mail já cadastrado", 409);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.userRepository.update(id, data);
    return excludePassword(updated);
  }
}
