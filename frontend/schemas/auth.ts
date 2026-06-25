import z from "zod";

const AuthFormSchema = z.object({
  email: z.email({ message: "Введите корректный email" }),
  username: z.string().min(4, { message: "Минимум 4 символа" }).max(50, { message: "Максимум 50 символов" }).optional(),
  password: z.string().min(6, { message: "Минимум 6 символов" }).max(100, { message: "Максимум 100 символов" }),
});

export default AuthFormSchema;
