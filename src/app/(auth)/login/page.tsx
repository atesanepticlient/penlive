"use client";
import React from "react";

import AuthModal from "@/components/auth/auth-modal";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  return (
    <div className="platform-bg w-full h-screen absolute top-0 left-0 right-0">
      {/* <AuthContainer
        title="Login"
        formRedirectLinkPlaceholder="Register"
        formRedirectText="No account yet? "
        formRediretLink="/register"
      >
        <LoginForm />
      </AuthContainer> */}

      <AuthModal
        onClose={() => null}
        show
        selectModal="login"
        positionMode="page"
        onSelect={(mode) => {
          if (mode == "register") {
            router.replace("/register");
          }
        }}
      />
    </div>
  );
};

export default Login;
