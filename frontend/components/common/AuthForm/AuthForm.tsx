import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import AuthFormSchema from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import BaseInput from "../BaseInput/BaseInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AuthForm = ({ mode, onSubmit }: { mode: "register" | "login"; onSubmit: (data: z.infer<typeof AuthFormSchema>) => void }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:max-w-3/5 bg-neutral-900 gap-5">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Добро пожаловать в StreamVault!</CardTitle>
          <CardDescription className="text-lg">Войдите или зарегистрируйтесь</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-3">
            <BaseInput label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />

            <BaseInput label={"Имя пользователя"} value={username} onChange={(e) => setUsername(e.target.value)} />

            <BaseInput label={"Пароль"} value={password} onChange={(e) => setPassword(e.target.value)} />
          </form>

          <Button variant="outline" className="w-full">
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
