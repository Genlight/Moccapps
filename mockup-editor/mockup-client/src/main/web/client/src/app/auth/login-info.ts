export class AuthLoginInfo {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public toString = (): string => {
    return `AuthLoginInfo (username: ${this.username} password: ${this.password} )`;
  }
}
