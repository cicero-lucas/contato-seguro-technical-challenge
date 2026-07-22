import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { IAuthLoginDTO, IAuthRegisterDTO, IAuthResponse, IJwtPayload } from "../interfaces/IAuth";
import { AppError } from "../utils/AppError";
import { excludePassword } from "../utils/excludePassword";
import { env } from "../config/env";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: IAuthRegisterDTO): Promise<IAuthResponse> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new AppError("E-mail já cadastrado", 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({ ...data, password: hashedPassword });

    const token = this.generateToken(user.id, user.email);
    return { token, user: excludePassword(user) };
  }

  async login(data: IAuthLoginDTO): Promise<IAuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new AppError("Credenciais inválidas", 401);

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) throw new AppError("Credenciais inválidas", 401);

    const token = this.generateToken(user.id, user.email);
    return { token, user: excludePassword(user) };
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("Usuário não encontrado", 404);
    return excludePassword(user);
  }

  private generateToken(userId: string, email: string): string {
    const payload: IJwtPayload = { sub: userId, email };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
  }
}
