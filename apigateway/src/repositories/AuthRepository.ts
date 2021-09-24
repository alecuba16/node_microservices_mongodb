import { Iuser } from "../models/Iuser";

export interface AuthRepository {
  connect(): Promise<AuthRepository | Error>;
  disconnect(): Promise<any>;
  findOneByUsername(username: string): Promise<Iuser | Error>;
}
