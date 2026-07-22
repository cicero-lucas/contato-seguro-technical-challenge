import { Channel } from "@prisma/client";

export interface IClassificationResult {
  channel: Channel;
}

export interface IClassificationService {
  classify(message: string): Promise<IClassificationResult>;
}
