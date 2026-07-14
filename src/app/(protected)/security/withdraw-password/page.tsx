/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { setWithdrawPassword, updatePassword } from "@/action/account";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/hook/useCurrentUser";
import {
  passwordChangeSchema,
  PasswordChangeSchema,
  setPasswordChangeSchema,
  SetPasswordChangeSchema,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoArrowBackSharp } from "react-icons/io5";

// ── Icons ────────────────────────────────────────────────────────────────────

const ChipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="4"
      y="4"
      width="8"
      height="8"
      rx="1.5"
      stroke="#185FA5"
      strokeWidth="1.3"
    />
    <path
      d="M6 4V2M9 4V2M6 12v2M9 12v2M4 6H2M4 9H2M12 6h2M12 9h2"
      stroke="#185FA5"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <rect
      x="6.5"
      y="6.5"
      width="3"
      height="3"
      rx="0.5"
      fill="#185FA5"
      fillOpacity="0.5"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5L13 3.5V7.5C13 11 10.5 13.5 8 14.5C5.5 13.5 3 11 3 7.5V3.5L8 1.5Z"
      stroke="#185FA5"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M6 8l1.5 1.5L10.5 6"
      stroke="#185FA5"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Reusable Field Wrapper ────────────────────────────────────────────────────

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
    <label className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 mb-1.5 tracking-wide uppercase">
      {icon}
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-stone-400 mt-1 pl-1">{hint}</p>}
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────

const WithdrawPasswordChange = () => {
  const user: any = useCurrentUser();
  const [pending, startTr] = useTransition();

  const formUpdate = useForm<PasswordChangeSchema>({
    defaultValues: { currentPassword: "", newPassword: "" },
    resolver: zodResolver(passwordChangeSchema),
  });

  const formSet = useForm<SetPasswordChangeSchema>({
    defaultValues: { password: "" },
    resolver: zodResolver(setPasswordChangeSchema),
  });

  const handleUpdate = (data: PasswordChangeSchema) => {
    startTr(() => {
      updatePassword(data).then((res) => {
        if (res.error) toast.error(res.error);
        else if (res.success) toast.success("Password Changed successfully");
      });
    });
  };

  const handleSet = (data: SetPasswordChangeSchema) => {
    startTr(() => {
      setWithdrawPassword(data).then((res) => {
        if (res.error) toast.error(res.error);
        else if (res.success) {
          toast.success("Password Set successfully");
          location.reload();
        }
      });
    });
  };

  const hasPassword = user?.withdrawPassword;
  const router = useRouter();
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFFDF5 0%, #EFF6FF 100%)",
      }}
    >
      {/* ── Header ── */}
      {/* <div
        className="relative overflow-hidden px-5 pt-4 pb-8"
        style={{
          background:
            "linear-gradient(135deg, #1A1208 0%, #2D1F0A 50%, #1A1208 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 24px)",
          }}
        />
        <SiteHeader title="" />
        <div className="relative mt-1">
          <h1
            className="text-lg font-semibold text-amber-200 tracking-widest"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Withdraw Password
          </h1>
          <p
            className="text-[10px] tracking-[3px] text-amber-600/60 uppercase mt-0.5"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {hasPassword ? "Change Password" : "Set New Password"}
          </p>
        </div>
        <div
          className="mt-4 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          }}
        />
      </div> */}

      <div className="px-4 mt-4 pb-10">
        {/* ── Info Banner ── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/40 p-4 mb-4 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <IoArrowBackSharp className="text-[#185FA5] text-2xl" />
          </button>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="3"
                y="6"
                width="14"
                height="10"
                rx="2"
                fill="#185FA5"
                fillOpacity="0.12"
                stroke="#185FA5"
                strokeWidth="1.4"
              />
              <path d="M3 9.5h14" stroke="#185FA5" strokeWidth="1.4" />
              <path
                d="M6 13h4"
                stroke="#185FA5"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M17 13.5l4-2v4.5C21 18.5 19.5 20 17 21c-2.5-1-4-2.5-4-4V11.5l4 2Z"
                fill="#185FA5"
                fillOpacity="0.85"
              />
              <path
                d="M15.5 15.5l1.2 1.3L18.5 14"
                stroke="white"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {hasPassword ? "Update Withdrawal PIN" : "Create Withdrawal PIN"}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              {hasPassword
                ? "Keep your funds secured with a strong password"
                : "Set a password to protect your withdrawals"}
            </p>
          </div>
        </div>

        {/* ── Status Pill ── */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-4 ${
            hasPassword
              ? "bg-emerald-50 border-emerald-100"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${hasPassword ? "bg-emerald-500" : "bg-amber-400"}`}
          />
          <p
            className={`text-xs font-medium ${hasPassword ? "text-emerald-700" : "text-amber-700"}`}
          >
            {hasPassword
              ? "Withdraw password is active"
              : "No withdraw password set yet"}
          </p>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-4">
          {hasPassword ? (
            <Form {...formUpdate}>
              <form
                onSubmit={formUpdate.handleSubmit(handleUpdate)}
                className="space-y-1"
              >
                <FormField
                  control={formUpdate.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <CasinoField label="Current Password" icon={<ChipIcon />}>
                        <FormControl>
                          <Input
                            disabled={pending}
                            type="password"
                            {...field}
                            placeholder="Enter current password"
                            className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50/30 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </CasinoField>
                    </FormItem>
                  )}
                />

                <FormField
                  control={formUpdate.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <CasinoField
                        label="New Password"
                        icon={<ShieldCheckIcon />}
                        hint="Min 8 characters · letters & numbers recommended"
                      >
                        <FormControl>
                          <Input
                            disabled={pending}
                            type="password"
                            {...field}
                            placeholder="Enter new password"
                            className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50/30 rounded-xl"
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
          ) : (
            <Form {...formSet}>
              <form
                onSubmit={formSet.handleSubmit(handleSet)}
                className="space-y-1"
              >
                <FormField
                  control={formSet.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <CasinoField
                        label="Set Password"
                        icon={<ShieldCheckIcon />}
                        hint="Min 8 characters · letters & numbers recommended"
                      >
                        <FormControl>
                          <Input
                            disabled={pending}
                            type="password"
                            {...field}
                            placeholder="Create a withdraw password"
                            className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50/30 rounded-xl"
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
                  {pending ? "Setting..." : "Set Password"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawPasswordChange;
