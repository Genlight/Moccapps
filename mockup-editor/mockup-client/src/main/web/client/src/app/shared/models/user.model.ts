export class UserModel {
  id: number;
  username: string;
  email: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }

  public toString = (): string => {
    return `UserModel (id: ${this.id} username: ${this.username} email: ${this.email})`;
  }
}

