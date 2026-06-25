"use client";

import AuthForm from "@/components/common/AuthForm/AuthForm";
import AuthFormSchema from "@/schemas/auth";
import { useState } from "react";
import z from "zod";

const LoginPage = () => {
  function onSubmit(data: z.infer<typeof AuthFormSchema>) {
    // Do something with the form values.
    console.log(data);
  }

  return <AuthForm mode={"register"} onSubmit={onSubmit} />;
};

export default LoginPage;
