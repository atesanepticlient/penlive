/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { updateProfile } from "@/action/account";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/hook/useCurrentUser";
import { accountUpdateSchema, AccountUpdateSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoArrowBackSharp } from "react-icons/io5";

// ── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.8" stroke="#92620A" strokeWidth="1.4" />
    <path
      d="M2 14c0-2.76 2.69-5 6-5s6 2.24 6 5"
      stroke="#92620A"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IdIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="1"
      y="3"
      width="14"
      height="10"
      rx="2"
      stroke="#92620A"
      strokeWidth="1.4"
    />
    <circle cx="5.5" cy="7.5" r="1.5" fill="#92620A" fillOpacity="0.4" />
    <path
      d="M8.5 6.5h4M8.5 8.5h2.5"
      stroke="#92620A"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="4"
      y="1"
      width="8"
      height="14"
      rx="2"
      stroke="#92620A"
      strokeWidth="1.4"
    />
    <circle cx="8" cy="12.5" r="0.8" fill="#92620A" />
    <path
      d="M6.5 3.5h3"
      stroke="#92620A"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="#92620A" strokeWidth="1.4" />
    <path
      d="M9.5 4.5H8.5C7.67 4.5 7 5.17 7 6v1H5.5v2H7v4h2v-4h1.5l.5-2H9V6c0-.28.22-.5.5-.5H9.5V4.5Z"
      fill="#92620A"
      fillOpacity="0.7"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1.5L12 3.5V7C12 10 9.5 12.5 7 13C4.5 12.5 2 10 2 7V3.5L7 1.5Z"
      stroke="#C9A84C"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M5 7l1.5 1.5L9.5 5.5"
      stroke="#C9A84C"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Styled Form Field ────────────────────────────────────────────────────────

const CasinoField = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1.5 tracking-wide uppercase">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────

const MyAccount = () => {
  const user: any = useCurrentUser();
  const [pending, startTr] = useTransition();

  const form = useForm<AccountUpdateSchema>({
    defaultValues: {
      facebook: user!.facebook || "",
      name: user!.name || "Pro User",
      phone: user!.phone || "",
    },
    resolver: zodResolver(accountUpdateSchema),
  });

  const handleUpdate = (data: AccountUpdateSchema) => {
    startTr(() => {
      updateProfile(data).then((res) => {
        if (res.error) toast.error(res.error);
        else if (res.success) toast.success("Information Updated");
      });
    });
  };
  const router = useRouter();
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFFDF5 0%, #FFF8E1 100%)",
      }}
    >
      <div className="px-4 mt-4 pb-10">
        {/* ── Avatar Card ── */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-lg shadow-amber-100/60 p-4 mb-4 flex items-center gap-4">
          <button onClick={() => router.back()}>
            <IoArrowBackSharp className="text-amber-900 text-2xl" />
          </button>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-amber-900 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #F0D080, #C9A84C)" }}
          >
            {(user?.name?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-stone-800 text-sm">
              {user?.name || "Pro User"}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Player ID · 932745783
            </p>
            <div
              className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-900"
              style={{
                background: "linear-gradient(135deg, #F0D080, #C9A84C)",
              }}
            >
              ✦ VIP Member
            </div>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-md shadow-amber-50 p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="space-y-1"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <CasinoField label="User Name" icon={<UserIcon />}>
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="text"
                          {...field}
                          placeholder="User Name"
                          className="border-amber-200 focus-visible:ring-amber-400 bg-amber-50/40 rounded-xl"
                        />
                      </FormControl>
                    </CasinoField>
                  </FormItem>
                )}
              />

              <FormField
                name="playerid"
                render={() => (
                  <FormItem>
                    <CasinoField label="Player ID" icon={<IdIcon />}>
                      <FormControl>
                        <Input
                          readOnly
                          disabled
                          value="932745783"
                          type="number"
                          className="border-amber-100 bg-amber-50/60 text-stone-400 rounded-xl cursor-not-allowed"
                        />
                      </FormControl>
                    </CasinoField>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <CasinoField label="Phone Number" icon={<PhoneIcon />}>
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="text"
                          {...field}
                          placeholder="Phone Number"
                          className="border-amber-200 focus-visible:ring-amber-400 bg-amber-50/40 rounded-xl"
                        />
                      </FormControl>
                    </CasinoField>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <CasinoField label="Facebook" icon={<FacebookIcon />}>
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="text"
                          {...field}
                          placeholder="Your Facebook Link"
                          className="border-amber-200 focus-visible:ring-amber-400 bg-amber-50/40 rounded-xl"
                        />
                      </FormControl>
                    </CasinoField>
                  </FormItem>
                )}
              />

              <Link
                href="/security"
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 py-2"
              >
                <ShieldIcon />
                Check Account Safety
              </Link>

              <Button
                disabled={pending}
                className="w-full rounded-xl text-amber-900 font-bold tracking-wide h-11 mt-1 border-0"
                style={{
                  background: "linear-gradient(135deg, #F0D080, #C9A84C)",
                }}
              >
                {pending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
