export type RegisterRequest = {
  name: string;
  phone: string;
  password: string;
};

export type LoginRequest = {
  phone: string;
  password: string;
};
