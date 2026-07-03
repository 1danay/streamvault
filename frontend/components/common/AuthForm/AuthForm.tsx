import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import AuthFormSchema from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import BaseInput from "../BaseInput/BaseInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type AuthMode = "login" | "register";

const AuthForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof AuthFormSchema>) => void }) => {
  const [mode, setMode] = useState<AuthMode>("login");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md bg-[#0F0F1A] border border-[#23A067]/30 rounded-2xl p-8 shadow-none">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Image src={"/logo.png"} alt="logo" width={32} height={32} />
            <span className="text-white font-medium text-sm tracking-tight">StreamVault</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight leading-tight mb-1">
            Добро пожаловать в <span className="bg-linear-to-r from-[#227D57] to-[#29BE7D] bg-clip-text text-transparent">StreamVault</span>
          </h1>
          <p className="text-sm text-white/40">{mode === "login" ? "Войдите, чтобы продолжить" : "Создайте аккаунт бесплатно"}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex bg-white/4 border border-white/6 rounded-lg p-0.75 mb-6">
            {(["login", "register"] as AuthMode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                  mode === tab ? "bg-[#29BE7D]/15 text-[#26C07A] border border-[#23A067]/25" : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-white/30">
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#26C07A] hover:text-[#2adf8e] transition-colors duration-150 cursor-pointer"
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
