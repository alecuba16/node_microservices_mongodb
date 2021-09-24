export interface Iuser extends Document {
  id: number;
  username: string;
  password: string;
  role: string;
}
