export type RegisterRequest = {
  username: string;
  phone: string;
  password: string;
};

export type LoginRequest = {
  phone: string;
  password: string;
};
