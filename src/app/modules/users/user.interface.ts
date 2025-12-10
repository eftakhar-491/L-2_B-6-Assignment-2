enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}
