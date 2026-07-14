import React from "react";
// import Variant1 from "@/components/icons/Variant1";
// import Variant2 from "@/components/icons/Variant2";
import Link from "next/link";
// import { Variant3 } from "../../icons/Variant3";

interface AuthContainerProps {
  title: string;
  formRedirectText: string;
  formRediretLink: string;
  formRedirectLinkPlaceholder: string;
  children: React.ReactNode;
}
import logo from "@/../public/logo.png";
import Image from "next/image";

const AuthContaner = ({
  formRedirectText,
  formRediretLink,
  formRedirectLinkPlaceholder,
  children,
  title,
}: AuthContainerProps) => {
  return (
    <div className=" ">
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        {/* Background subtle glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-black pointer-events-none" />

        <div className="relative w-full max-w-md p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl backdrop-blur-xl shadow-2xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center ">
            <div className="flex justify-center py-3 pt-12">
              <Image src={logo} alt="ck444" className="w-[100px] h-auto" />
            </div>
          </div>
          <div className="text-center mb-5">
            <span className="text-3xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
              {title}
            </span>
          </div>

          <div>{children}</div>

          <div className="mt-3  text-center">
            <span className="text-white">
              {formRedirectText}{" "}
              <Link href={formRediretLink} className="text-[#f4cb46] underline">
                {formRedirectLinkPlaceholder}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthContaner;
