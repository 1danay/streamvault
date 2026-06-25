"use client";

import AuthFormSchema from "@/schemas/auth";
import { z } from "zod";
import AuthForm from "@/components/common/AuthForm/AuthForm";

const RegisterPage = () => {
  function onSubmit(data: z.infer<typeof AuthFormSchema>) {
    // Do something with the form values.
    console.log(data);
  }

  return <AuthForm mode={"register"} onSubmit={onSubmit} />;
};

export default RegisterPage;
