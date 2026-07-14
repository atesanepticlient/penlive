"use client";

import React from "react";

import AuthModal from "@/components/auth/auth-modal";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  return (
    <div className="platform-bg w-full h-screen absolute top-0 left-0 right-0">
      {/* <AuthContainer
        title="Register"
        formRedirectLinkPlaceholder="Login"
        formRedirectText="You already have an account"
        formRediretLink="/login"
      >
        <RegisterForm />
      </AuthContainer> */}

      <AuthModal
        onClose={() => null}
        show
        selectModal="register"
        positionMode="page"
        onSelect={(mode) => {
          if (mode == "login") {
            router.replace("/login");
          }
        }}
      />
    </div>
  );
};

export default Register;
