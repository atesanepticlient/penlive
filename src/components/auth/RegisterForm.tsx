"use client";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RiCloseCircleLine } from "react-icons/ri";
import zod from "zod";
import { registerSchema } from "@/schema";

import { FaEyeSlash, FaEye, FaUserAstronaut, FaPhone } from "react-icons/fa6";
import { IoLockOpen } from "react-icons/io5";
import CheckInput from "./CheckInput";
import { redirect, useSearchParams } from "next/navigation";
import { register } from "@/action/register";
import { toast } from "react-hot-toast";
import SpinLoader from "../loader/SpinLoader";
import {
  createLocalStoreDataByKey,
  getLocalStoreDataByKey,
} from "@/lib/localstore";
import { useText } from "@/hook/useText";

const RegisterForm = () => {
  const t = useText("/register");
  const referId = useSearchParams().get("r") || "";
  const affiliateCode = useSearchParams().get("a") || "";
  const [pending, startTransiction] = useTransition();
  const form = useForm<zod.infer<typeof registerSchema>>({
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
      ageCheck: true,
      bonusCheck: false,
      referralId: referId,
      affiliateCode: affiliateCode,
      ipSign: getLocalStoreDataByKey("-entry-token") || "",
    },
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = (data: zod.infer<typeof registerSchema>) => {
    if (!data.ageCheck) return;

    startTransiction(() => {
      register(data).then((res) => {
        if (res.success) {
          if (res.localStore) {
            res.localStore.forEach(({ key, value }) => {
              createLocalStoreDataByKey(key, value);
            });
          }
          redirect("/");
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    });
  };

  const [passwordShow, setPasswordShow] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({ password: false, confirmPassword: false });

  // Common Input Style for consistency
  const inputBaseClass = `
    w-full mb-3 outline-none text-sm px-10 py-3.5 
    bg-[#0A0A0A] text-white rounded-xl overflow-hidden 
    border border-white/10 focus:border-[#D4AF37]/50 
    transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
    placeholder:text-white/30 font-medium
  `;

  const iconBaseClass = "w-4 h-4 text-[#F9E498] opacity-70";

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="space-y-1"
        >
          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <input
                      placeholder={
                        (t as any)?.register?.form?.phone?.placeholder ||
                        "Enter Phone Number"
                      }
                      disabled={pending}
                      {...field}
                      className={inputBaseClass}
                      autoComplete="off"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-[65%]">
                      <FaPhone className={iconBaseClass} />
                    </div>
                    {form.watch("phone") && (
                      <button
                        type="button"
                        onClick={() => form.setValue("phone", "")}
                        className="absolute right-3.5 top-1/2 -translate-y-[65%] hover:text-red-400 transition-colors"
                      >
                        <RiCloseCircleLine
                          size={18}
                          className="text-white/40"
                        />
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] ml-2" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <input
                      type={passwordShow.password ? "text" : "password"}
                      placeholder={
                        (t as any)?.register?.form?.password?.placeholder ||
                        "Create Password"
                      }
                      disabled={pending}
                      {...field}
                      className={inputBaseClass}
                      autoComplete="off"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-[65%]">
                      <IoLockOpen className={iconBaseClass} />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordShow((s) => ({
                          ...s,
                          password: !s.password,
                        }))
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-[65%] text-white/40 hover:text-[#F9E498]"
                    >
                      {passwordShow.password ? (
                        <FaEye size={16} />
                      ) : (
                        <FaEyeSlash size={16} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] ml-2" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <input
                      type={passwordShow.confirmPassword ? "text" : "password"}
                      placeholder={
                        (t as any)?.register?.form?.confirmPassword
                          ?.placeholder || "Confirm Password"
                      }
                      disabled={pending}
                      {...field}
                      className={inputBaseClass}
                      autoComplete="off"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-[65%]">
                      <IoLockOpen className={iconBaseClass} />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordShow((s) => ({
                          ...s,
                          confirmPassword: !s.confirmPassword,
                        }))
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-[65%] text-white/40 hover:text-[#F9E498]"
                    >
                      {passwordShow.confirmPassword ? (
                        <FaEye size={16} />
                      ) : (
                        <FaEyeSlash size={16} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] ml-2" />
              </FormItem>
            )}
          />

          {/* Referral Field */}
          <FormField
            control={form.control}
            name="referralId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <input
                      placeholder="Referral ID (Optional)"
                      disabled={pending}
                      {...field}
                      className={inputBaseClass}
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-[65%]">
                      <FaUserAstronaut className={iconBaseClass} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] ml-2" />
              </FormItem>
            )}
          />

          {/* Checkboxes */}
          <div className="py-2 flex flex-col gap-3">
            <CheckInput
              defaultCheck
              onChecked={(checked) => form.setValue("ageCheck", checked)}
              label="I am 18+ and accept the Terms & Conditions and Privacy Policy."
            />
            <CheckInput
              onChecked={(checked) => form.setValue("bonusCheck", checked)}
              label="I want to receive special offers and bonus promotions."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={pending || !form.watch("ageCheck")}
            className={`
              w-full h-[50px] mt-4 rounded-xl font-black uppercase tracking-widest text-sm
              transition-all duration-300 active:scale-[0.98]
              flex items-center justify-center relative overflow-hidden
              ${
                pending || !form.watch("ageCheck")
                  ? "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                  : "bg-gradient-to-b from-[#F9E498] via-[#D4AF37] to-[#8A6E2F] text-black shadow-[0_4px_20px_rgba(212,175,55,0.3)] border border-[#F9E498]/50 hover:brightness-110"
              }
            `}
          >
            {pending ? "Processing..." : "Register Now"}
            {/* Glossy Overlay effect for button */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </button>
        </form>
      </Form>

      {pending && <SpinLoader />}
    </div>
  );
};

export default RegisterForm;
