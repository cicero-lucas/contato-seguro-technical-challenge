import { Channel, Priority } from "@prisma/client";

export interface IClassificationResult {
  channel: Channel;
  priority: Priority;
}

export interface IClassificationService {
  classify(message: string): Promise<IClassificationResult>;
}
