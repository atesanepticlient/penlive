"use client";
import { updatePassword } from "@/action/account";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordChangeSchema, PasswordChangeSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoArrowBackSharp } from "react-icons/io5";

// ── Icons ────────────────────────────────────────────────────────────────────

const LockOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="3"
      y="7"
      width="10"
      height="8"
      rx="2"
      stroke="#0F6E56"
      strokeWidth="1.4"
    />
    <path
      d="M5.5 7V5a2.5 2.5 0 015 0"
      stroke="#0F6E56"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="8" cy="11" r="1.2" fill="#0F6E56" />
    <rect x="7.4" y="11" width="1.2" height="1.8" rx="0.4" fill="#0F6E56" />
  </svg>
);

const LockNewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="3"
      y="7"
      width="10"
      height="8"
      rx="2"
      fill="#0F6E56"
      fillOpacity="0.1"
      stroke="#0F6E56"
      strokeWidth="1.4"
    />
    <path
      d="M5.5 7V5a2.5 2.5 0 015 0V7"
      stroke="#0F6E56"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="8" cy="11" r="1.2" fill="#0F6E56" />
    <rect x="7.4" y="11" width="1.2" height="1.8" rx="0.4" fill="#0F6E56" />
    <path
      d="M11 3.5l.8-.8M12 5h1M11 6.5l.8.8"
      stroke="#0F6E56"
      strokeWidth="1"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
  </svg>
);

// ── Reusable field wrapper ───────────────────────────────────────────────────

const CasinoField = ({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1.5 tracking-wide uppercase">
      {icon}
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-stone-400 mt-1 pl-1">{hint}</p>}
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────

const PasswordChange = () => {
  const [pending, startTr] = useTransition();

  const form = useForm<PasswordChangeSchema>({
    defaultValues: { currentPassword: "", newPassword: "" },
    resolver: zodResolver(passwordChangeSchema),
  });

  const handleUpdate = (data: PasswordChangeSchema) => {
    startTr(() => {
      updatePassword(data).then((res) => {
        if (res.error) toast.error(res.error);
        else if (res.success) toast.success("Password Changed successfully");
      });
    });
  };
  const router = useRouter();
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFFDF5 0%, #F0FFF8 100%)",
      }}
    >
      {/* ── Header ── */}

      <div className="px-4 mt-4 pb-10">
        {/* ── Info Banner ── */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-100/40 p-4 mb-4 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <IoArrowBackSharp className="text-[#0F6E56] text-2xl" />
          </button>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="5"
                y="10"
                width="12"
                height="9"
                rx="2.5"
                fill="#0F6E56"
                fillOpacity="0.12"
                stroke="#0F6E56"
                strokeWidth="1.5"
              />
              <path
                d="M8 10V7.5a4 4 0 018 0V10"
                stroke="#0F6E56"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="11" cy="15" r="1.8" fill="#0F6E56" />
              <rect
                x="10.2"
                y="15"
                width="1.6"
                height="2.2"
                rx="0.6"
                fill="#0F6E56"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Secure Your Account
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Use letters, numbers & symbols for a strong password
            </p>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-md p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="space-y-1"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <CasinoField
                      label="Current Password"
                      icon={<LockOpenIcon />}
                    >
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="password"
                          {...field}
                          placeholder="Enter current password"
                          className="border-emerald-200 focus-visible:ring-emerald-400 bg-emerald-50/30 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </CasinoField>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <CasinoField
                      label="New Password"
                      icon={<LockNewIcon />}
                      hint="Min 8 characters · letters & numbers recommended"
                    >
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="password"
                          {...field}
                          placeholder="Enter new password"
                          className="border-emerald-200 focus-visible:ring-emerald-400 bg-emerald-50/30 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </CasinoField>
                  </FormItem>
                )}
              />

              <Button
                disabled={pending}
                className="w-full rounded-xl text-amber-900 font-bold tracking-wide h-11 mt-2 border-0"
                style={{
                  background: "linear-gradient(135deg, #F0D080, #C9A84C)",
                }}
              >
                {pending ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
