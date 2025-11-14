export interface User {
  _id: string;
  name: string;
  surname: string;
  phone: string;
  role: string;
}

export type EditCurrentUser = Pick<User, 'name' | 'surname' | 'phone'>;
