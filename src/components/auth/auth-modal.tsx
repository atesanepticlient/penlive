"use client";

import { useEffect, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Rajdhani, Teko } from "next/font/google";
import { IoCloseCircleOutline } from "react-icons/io5";
import { login } from "@/action/login";
import toast from "react-hot-toast";
import { register } from "@/action/register";
import { useSearchParams } from "next/navigation";
import zod from "zod";
import { loginSchema, registerSchema } from "@/schema";
import {
  createLocalStoreDataByKey,
  getLocalStoreDataByKey,
} from "@/lib/localstore";
import { changePassword, sendOtp, verifyForgetOtp } from "@/action/forget";
import { INTERNAL_SERVER_ERROR } from "@/error";
import useTimeCountDown from "@/hook/useTimeCountDown";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type AuthMode = "login" | "register" | "forgot";
type ForgotStep = "phone" | "otp" | "password";
type PasswordField =
  | "login"
  | "register"
  | "confirm"
  | "forgot"
  | "forgotConfirm";

type LoginValues = zod.infer<typeof loginSchema>;
type RegisterFormValues = zod.infer<typeof registerSchema>;

// type RegisterValues = {
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   referralId?: string;
//   acceptedTerms: boolean;
//   wantsOffers: boolean;
//   affiliateCode?: string;
//   ipSign?: string;
// };

const phoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

const forgotPhoneSchema = zod.object({
  phone: zod
    .string()
    .min(1, "Phone Number is required")
    .regex(phoneRegex, "Invalid Phone Number"),
});

const forgotOtpSchema = zod.object({
  otp: zod
    .string()
    .min(4, "OTP code is required")
    .max(6, "Invalid OTP code")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

const forgotPasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: zod.string(),
  })
  .refine(
    ({ password, confirmPassword }) => {
      if (password && confirmPassword) {
        return password === confirmPassword;
      }
      return true;
    },
    { path: ["confirmPassword"], message: "Confirm Password didn't match" },
  );

type ForgotPhoneValues = zod.infer<typeof forgotPhoneSchema>;
type ForgotOtpValues = zod.infer<typeof forgotOtpSchema>;
type ForgotPasswordValues = zod.infer<typeof forgotPasswordSchema>;

type AuthCardProps = {
  onSelect?: (mode: AuthMode) => void;
  className?: string;
  children?: ReactNode;
  selectModal?: AuthMode;
  show?: boolean;
  positionMode?: "modal" | "page";
  onClose: () => void;
};

function Icon({
  name,
  className,
}: {
  name: "diamond" | "phone" | "lock" | "user" | "eye" | "eyeOff" | "x";
  className?: string;
}) {
  if (name === "diamond") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 22 12 12 22 2 12 12 2Z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.89.67 2.78a2 2 0 0 1-.45 2.11L8.05 9.89a16 16 0 0 0 6.06 6.06l1.28-1.28a2 2 0 0 1 2.11-.45c.89.32 1.82.54 2.78.67A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (name === "eye") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === "eyeOff") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 3 18 18" />
        <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
        <path d="M9.88 5.19A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17.9 17.9 0 0 1-3.22 4.12" />
        <path d="M6.61 6.61C3.61 8.64 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.39-1.05" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function AuthModal({
  className = "",
  show = false,
  selectModal = "login",
  onClose,
  positionMode,
  onSelect,
}: AuthCardProps) {
  const referId = useSearchParams().get("r") || "";
  const affiliateCode = useSearchParams().get("a") || "";

  const [mode, setMode] = useState<AuthMode>(selectModal);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("phone");
  const [pending, setPending] = useState<AuthMode | null>(null);
  const [forgetPasswordOtpExpiry, setForgetPasswordOtpExpiry] = useState(null);
  const [visiblePassword, setVisiblePassword] = useState<
    Record<PasswordField, boolean>
  >({
    login: false,
    register: false,
    confirm: false,
    forgot: false,
    forgotConfirm: false,
  });

  const loginForm = useForm<LoginValues>({
    defaultValues: {
      phone: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormValues>({
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

  const forgotPhoneForm = useForm<ForgotPhoneValues>({
    defaultValues: {
      phone: "",
    },
    resolver: zodResolver(forgotPhoneSchema),
  });

  const forgotOtpForm = useForm<ForgotOtpValues>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(forgotOtpSchema),
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const acceptedTerms = registerForm.watch("ageCheck");
  const isRegisterDisabled = pending === "register" || !acceptedTerms;

  function selectMode(nextMode: AuthMode) {
    setMode(nextMode);
    if (nextMode === "forgot") {
      setForgotStep("phone");
      return;
    }

    forgotPhoneForm.reset();
    forgotOtpForm.reset();
    forgotPasswordForm.reset();
    
    onSelect?.(nextMode);
  }

  function togglePassword(field: PasswordField) {
    setVisiblePassword((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  async function handleLogin(data: LoginValues) {
    setPending("login");

    try {
      await login(data).then((res) => {
        if (res.success) {
          window.location.reload();
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    } finally {
      setPending(null);
    }
  }

  async function handleRegister(data: RegisterFormValues) {
    if (!data.ageCheck) {
      return;
    }

    setPending("register");

    try {
      await register({
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        ageCheck: data.ageCheck,
        bonusCheck: data.bonusCheck,
        referralId: data.referralId,
        affiliateCode: data.affiliateCode,
        ipSign: data.ipSign,
      }).then((res) => {
        if (res.success) {
          if (res.localStore) {
            res.localStore.forEach(({ key, value }) => {
              createLocalStoreDataByKey(key, value);
            });
          }
          location.reload();
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    } finally {
      setPending(null);
    }
  }

  async function handleForgotPhone() {
    setPending("forgot");

    try {
      const res = await sendOtp(forgotPhoneForm.getValues("phone"));
      if (res.sucess) {
        setForgetPasswordOtpExpiry(res.expiry);
        setForgotStep("otp");
      } else {
        toast.error(res.error);
      }
    } catch  {
      toast.error(INTERNAL_SERVER_ERROR);
    } finally {
      setPending(null);
    }
  }

  async function handleForgotOtp(data: ForgotOtpValues) {
    setPending("forgot");

    try {
      const otpPayload = {
        phone: forgotPhoneForm.getValues("phone"),
        otp: data.otp,
      };
      const res = await verifyForgetOtp(otpPayload.phone, otpPayload.otp);
      if (res.success) {
        setForgotStep("password");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error(INTERNAL_SERVER_ERROR);
    } finally {
      setPending(null);
    }
  }

  async function handleForgotPassword(data: ForgotPasswordValues) {
    setPending("forgot");

    try {
      const resetPayload = {
        phone: forgotPhoneForm.getValues("phone"),
        otp: forgotOtpForm.getValues("otp"),
        password: data.password,
      };
      const res = await changePassword(
        resetPayload.phone,
        registerForm.getValues("confirmPassword"),
      );
      if (res.success) {
        forgotPhoneForm.reset();
        forgotOtpForm.reset();
        forgotPasswordForm.reset();
        setForgotStep("phone");
        setMode("login");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error(INTERNAL_SERVER_ERROR);
    } finally {
      setPending(null);
    }
  }
  useEffect(() => {
    if (selectModal) {
      setMode(selectModal);
      if (selectModal === "forgot") {
        setForgotStep("phone");
      }
    }
  }, [selectModal]);

  const { concrete: otpExpiryCountDown } = useTimeCountDown({
    date: forgetPasswordOtpExpiry,
    formte: "m-s",
  });

  if (!show) return null;

  return (
    <div
      className={`${rajdhani.className} authCardShell !fixed !top-0 !left-0 !right-0 ${className} !z-[999] `}
    >
      <section
        className="scene !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !flex !justify-center !z-[999] !items-center w-full h-screen "
        aria-labelledby="auth-card-title"
      >
        {positionMode != "page" && (
          <div className="borderRing" onClick={() => onClose?.()} />
        )}
        <div className="inner border border-violet-950 relative">
          {positionMode != "page" && (
            <button
              className="top-5 right-5 absolute cursor-pointer"
              onClick={() => onClose?.()}
            >
              <IoCloseCircleOutline className="text-white/80 text-2xl cursor-pointer " />
            </button>
          )}

          <header className="header mt-4">
            <Icon name="diamond" className="diamondIcon" />
            <h2 id="auth-card-title" className={`${teko.className} title`}>
              {isForgot
                ? "Reset Password"
                : isLogin
                  ? "Welcome Back"
                  : "Join Now"}
            </h2>
          </header>

          {!isForgot && (
            <div
              className="tabs"
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                className={`tabButton ${isLogin ? "active" : ""}`}
                type="button"
                role="tab"
                aria-selected={isLogin}
                aria-controls="auth-login-panel"
                onClick={() => selectMode("login")}
              >
                Login
              </button>
              <button
                className={`tabButton ${isRegister ? "active" : ""}`}
                type="button"
                role="tab"
                aria-selected={isRegister}
                aria-controls="auth-register-panel"
                onClick={() => selectMode("register")}
              >
                Register
              </button>
            </div>
          )}

          {isLogin ? (
            <form
              id="auth-login-panel"
              className="tabContent !w-[330px]"
              role="tabpanel"
              onSubmit={loginForm.handleSubmit(handleLogin)}
            >
              <div className="fieldWrap">
                <Icon name="phone" className="inputIcon left" />
                <input
                  className="input"
                  placeholder="Enter Phone Number"
                  type="tel"
                  disabled={pending === "login"}
                  autoComplete="off"
                  {...loginForm.register("phone")}
                />
                {loginForm.watch("phone") && (
                  <button
                    className="iconButton"
                    type="button"
                    aria-label="Clear phone number"
                    onClick={() =>
                      loginForm.setValue("phone", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Icon name="x" />
                  </button>
                )}
              </div>
              {loginForm.formState.errors.phone?.message && (
                <p className="fieldError">
                  {loginForm.formState.errors.phone.message}
                </p>
              )}

              <div className="fieldWrap">
                <Icon name="lock" className="inputIcon left" />
                <input
                  className="input"
                  placeholder="Password"
                  type={visiblePassword.login ? "text" : "password"}
                  disabled={pending === "login"}
                  {...loginForm.register("password")}
                />
                <button
                  className="iconButton"
                  type="button"
                  aria-label={
                    visiblePassword.login ? "Hide password" : "Show password"
                  }
                  onClick={() => togglePassword("login")}
                >
                  <Icon name={visiblePassword.login ? "eyeOff" : "eye"} />
                </button>
              </div>
              {loginForm.formState.errors.password?.message && (
                <p className="fieldError">
                  {loginForm.formState.errors.password.message}
                </p>
              )}

              <div className="forgotLine">
                <button
                  className="footerLink"
                  type="button"
                  onClick={() => selectMode("forgot")}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                className={`${teko.className} submitButton`}
                type="submit"
                disabled={pending === "login"}
              >
                {pending === "login" ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : isRegister ? (
            <form
              id="auth-register-panel"
              className="tabContent !w-[330px] "
              role="tabpanel"
              onSubmit={registerForm.handleSubmit(handleRegister)}
            >
              <div className="fieldWrap">
                <Icon name="phone" className="inputIcon left" />
                <input
                  className="input"
                  placeholder="Enter Phone Number"
                  type="tel"
                  disabled={pending === "register"}
                  autoComplete="off"
                  {...registerForm.register("phone")}
                />
                {registerForm.watch("phone") && (
                  <button
                    className="iconButton"
                    type="button"
                    aria-label="Clear phone number"
                    onClick={() =>
                      registerForm.setValue("phone", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Icon name="x" />
                  </button>
                )}
              </div>
              {registerForm.formState.errors.phone?.message && (
                <p className="fieldError">
                  {registerForm.formState.errors.phone.message}
                </p>
              )}

              <div className="fieldWrap">
                <Icon name="lock" className="inputIcon left" />
                <input
                  className="input"
                  placeholder="Create Password"
                  type={visiblePassword.register ? "text" : "password"}
                  disabled={pending === "register"}
                  autoComplete="off"
                  {...registerForm.register("password")}
                />
                <button
                  className="iconButton"
                  type="button"
                  aria-label={
                    visiblePassword.register ? "Hide password" : "Show password"
                  }
                  onClick={() => togglePassword("register")}
                >
                  <Icon name={visiblePassword.register ? "eyeOff" : "eye"} />
                </button>
              </div>
              {registerForm.formState.errors.password?.message && (
                <p className="fieldError">
                  {registerForm.formState.errors.password.message}
                </p>
              )}

              <div className="fieldWrap">
                <Icon name="lock" className="inputIcon left" />
                <input
                  className="input"
                  placeholder="Confirm Password"
                  type={visiblePassword.confirm ? "text" : "password"}
                  disabled={pending === "register"}
                  autoComplete="off"
                  {...registerForm.register("confirmPassword")}
                />
                <button
                  className="iconButton"
                  type="button"
                  aria-label={
                    visiblePassword.confirm ? "Hide password" : "Show password"
                  }
                  onClick={() => togglePassword("confirm")}
                >
                  <Icon name={visiblePassword.confirm ? "eyeOff" : "eye"} />
                </button>
              </div>
              {registerForm.formState.errors.confirmPassword?.message && (
                <p className="fieldError">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}

              <div className="fieldWrap">
                <Icon name="user" className="inputIcon left" />
                <input
                  className="input withoutAction"
                  placeholder="Referral ID (Optional)"
                  disabled={pending === "register"}
                  {...registerForm.register("referralId")}
                />
              </div>

              <div className="divider" />

              <div className="checkList">
                <label className="checkItem">
                  <input
                    className="nativeCheckbox"
                    type="checkbox"
                    disabled={pending === "register"}
                    {...registerForm.register("ageCheck")}
                  />
                  <span className="checkBox" aria-hidden="true" />
                  <span className="checkLabel">
                    I am 18+ and accept the Terms & Conditions and Privacy
                    Policy.
                  </span>
                </label>

                <label className="checkItem">
                  <input
                    className="nativeCheckbox"
                    type="checkbox"
                    disabled={pending === "register"}
                    {...registerForm.register("bonusCheck")}
                  />
                  <span className="checkBox" aria-hidden="true" />
                  <span className="checkLabel">
                    I want to receive special offers and bonus promotions.
                  </span>
                </label>
              </div>

              <button
                className={`${teko.className} submitButton`}
                type="submit"
                disabled={isRegisterDisabled}
              >
                {pending === "register" ? "Processing..." : "Register Now"}
              </button>
            </form>
          ) : (
            <div
              id="auth-forgot-panel"
              className="tabContent !w-[330px]"
              role="tabpanel"
            >
              <div className="stepTrack" aria-label="Reset password steps">
                <span className={`stepDot active`} />
                <span
                  className={`stepDot ${
                    forgotStep === "otp" || forgotStep === "password"
                      ? "active"
                      : ""
                  }`}
                />
                <span
                  className={`stepDot ${
                    forgotStep === "password" ? "active" : ""
                  }`}
                />
              </div>

              {forgotStep === "phone" && (
                <form
                  onSubmit={forgotPhoneForm.handleSubmit(handleForgotPhone)}
                >
                  <div className="fieldWrap">
                    <Icon name="phone" className="inputIcon left" />
                    <input
                      className="input"
                      placeholder="Enter Phone Number"
                      type="tel"
                      disabled={pending === "forgot"}
                      autoComplete="off"
                      {...forgotPhoneForm.register("phone")}
                    />
                    {forgotPhoneForm.watch("phone") && (
                      <button
                        className="iconButton"
                        type="button"
                        aria-label="Clear phone number"
                        onClick={() =>
                          forgotPhoneForm.setValue("phone", "", {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <Icon name="x" />
                      </button>
                    )}
                  </div>
                  {forgotPhoneForm.formState.errors.phone?.message && (
                    <p className="fieldError">
                      {forgotPhoneForm.formState.errors.phone.message}
                    </p>
                  )}

                  <button
                    className={`${teko.className} submitButton`}
                    type="submit"
                    disabled={pending === "forgot"}
                  >
                    {pending === "forgot" ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              )}

              {forgotStep === "otp" && (
                <form onSubmit={forgotOtpForm.handleSubmit(handleForgotOtp)}>
                  <div className="fieldWrap">
                    <Icon name="lock" className="inputIcon left" />
                    <input
                      className="input otpInput"
                      placeholder="Enter OTP Code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      disabled={pending === "forgot"}
                      autoComplete="one-time-code"
                      {...forgotOtpForm.register("otp")}
                    />
                  </div>
                  {forgotOtpForm.formState.errors.otp?.message && (
                    <p className="fieldError">
                      {forgotOtpForm.formState.errors.otp.message}
                    </p>
                  )}
                  <div className="flex justify-end mb-2">
                    <span className="footerLink">
                      Expiry : {otpExpiryCountDown?.min} :{" "}
                      {otpExpiryCountDown?.sec}
                    </span>
                  </div>
                  <button
                    className={`${teko.className} submitButton`}
                    type="submit"
                    disabled={pending === "forgot"}
                  >
                    {pending === "forgot" ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    className="ghostButton"
                    type="button"
                    disabled={pending === "forgot"}
                    onClick={forgotPhoneForm.handleSubmit(handleForgotPhone)}
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {forgotStep === "password" && (
                <form
                  onSubmit={forgotPasswordForm.handleSubmit(
                    handleForgotPassword,
                  )}
                >
                  <div className="fieldWrap">
                    <Icon name="lock" className="inputIcon left" />
                    <input
                      className="input"
                      placeholder="New Password"
                      type={visiblePassword.forgot ? "text" : "password"}
                      disabled={pending === "forgot"}
                      autoComplete="off"
                      {...forgotPasswordForm.register("password")}
                    />
                    <button
                      className="iconButton"
                      type="button"
                      aria-label={
                        visiblePassword.forgot
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() => togglePassword("forgot")}
                    >
                      <Icon name={visiblePassword.forgot ? "eyeOff" : "eye"} />
                    </button>
                  </div>
                  {forgotPasswordForm.formState.errors.password?.message && (
                    <p className="fieldError">
                      {forgotPasswordForm.formState.errors.password.message}
                    </p>
                  )}

                  <div className="fieldWrap">
                    <Icon name="lock" className="inputIcon left" />
                    <input
                      className="input"
                      placeholder="Confirm New Password"
                      type={visiblePassword.forgotConfirm ? "text" : "password"}
                      disabled={pending === "forgot"}
                      autoComplete="off"
                      {...forgotPasswordForm.register("confirmPassword")}
                    />
                    <button
                      className="iconButton"
                      type="button"
                      aria-label={
                        visiblePassword.forgotConfirm
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() => togglePassword("forgotConfirm")}
                    >
                      <Icon
                        name={visiblePassword.forgotConfirm ? "eyeOff" : "eye"}
                      />
                    </button>
                  </div>
                  {forgotPasswordForm.formState.errors.confirmPassword
                    ?.message && (
                    <p className="fieldError">
                      {
                        forgotPasswordForm.formState.errors.confirmPassword
                          .message
                      }
                    </p>
                  )}

                  <button
                    className={`${teko.className} submitButton`}
                    type="submit"
                    disabled={pending === "forgot"}
                  >
                    {pending === "forgot" ? "Saving..." : "Update Password"}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="footerText">
            {isLogin
              ? "New here? "
              : isForgot
                ? "Remember password? "
                : "Already have an account? "}
            <button
              className="footerLink"
              type="button"
              onClick={() => selectMode(isLogin ? "register" : "login")}
            >
              {isLogin ? "Create Account" : "Login"}
            </button>
          </p>
        </div>
      </section>

      <style jsx>{`
        .authCardShell {
          align-items: center;
          background: #00000090;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          width: 100%;
        }

        .authCardShell *,
        .authCardShell *::before,
        .authCardShell *::after {
          box-sizing: border-box;
        }

        .scene {
          border-radius: 20px;

          width: 100%;
        }

        .borderRing {
          background: #00000090;
          border-radius: 20px;
          inset: 0;
          position: absolute;
          z-index: 0;
        }

        .inner {
          background: linear-gradient(160deg, #0d0720, #0a0418, #08031a);
          border-radius: 19px;
          overflow: hidden;
          padding: 28px 26px 30px;
          position: relative;
          z-index: 1;
        }

        .inner::before,
        .inner::after {
          content: "";
          pointer-events: none;
          position: absolute;
        }

        .inner::before {
          background: radial-gradient(
            circle,
            rgba(120, 0, 255, 0.18) 0%,
            transparent 70%
          );
          height: 180px;
          left: -60px;
          top: -60px;
          width: 180px;
        }

        .inner::after {
          background: radial-gradient(
            circle,
            rgba(200, 150, 0, 0.1) 0%,
            transparent 70%
          );
          bottom: -60px;
          height: 200px;
          right: -60px;
          width: 200px;
        }

        .chip {
          align-items: center;
          border: 2.5px solid currentColor;
          border-radius: 999px;
          display: flex;
          height: 34px;
          justify-content: center;
          opacity: 0.22;
          pointer-events: none;
          position: absolute;
          width: 34px;
        }

        .chip svg {
          fill: currentColor;
          height: 13px;
          width: 13px;
        }

        .chipOne {
          animation: chipFloat 3.5s ease-in-out infinite;
          color: #9b00ff;
          left: 18px;
          top: 18px;
        }

        .chipTwo {
          animation: chipFloatTwo 4s ease-in-out infinite;
          color: #d4af37;
          height: 24px;
          right: 52px;
          top: 26px;
          width: 24px;
        }

        .chipTwo svg {
          height: 9px;
          width: 9px;
        }

        .header {
          align-items: center;
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .diamondIcon {
          animation: neonPulse 2.5s ease-in-out infinite;
          fill: #b44fff;
          filter: drop-shadow(0 0 14px rgba(155, 0, 255, 0.9));
          height: 38px;
          margin-bottom: 6px;
          width: 38px;
        }

        .title {
          animation: shimmer 3s linear infinite;
          background: linear-gradient(
            135deg,
            #d4af37 0%,
            #fff5a0 40%,
            #d4af37 80%,
            #a87800 100%
          );
          background-clip: text;
          background-size: 200% auto;
          color: transparent;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 3px;
          line-height: 1;
          margin: 0;
          text-transform: uppercase;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tabs {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(155, 0, 255, 0.2);
          border-radius: 12px;
          display: grid;
          gap: 4px;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 22px;
          padding: 4px;
          position: relative;
          z-index: 1;
        }

        .tabButton {
          background: transparent;
          border: 0;
          border-radius: 9px;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          font: inherit;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1.5px;
          line-height: 1.2;
          min-height: 40px;
          padding: 10px 0;
          text-transform: uppercase;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .tabButton:hover {
          background: rgba(155, 0, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
        }

        .tabButton.active {
          background: linear-gradient(135deg, #5500cc, #8800ee, #6600bb);
          box-shadow:
            0 0 20px rgba(136, 0, 238, 0.5),
            0 0 40px rgba(136, 0, 238, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          color: #fff;
          text-shadow: 0 0 8px rgba(200, 150, 255, 0.8);
        }

        .tabContent {
          animation: tabIn 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .fieldWrap {
          margin-bottom: 11px;
          position: relative;
        }

        .fieldError {
          color: #ff6b81;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.25;
          margin: -5px 0 10px 2px;
          position: relative;
          z-index: 1;
        }

        .forgotLine {
          display: flex;
          justify-content: flex-end;
          margin: -2px 0 12px;
          position: relative;
          z-index: 1;
        }

        .stepTrack {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-content: center;
          margin: -4px 0 18px;
          position: relative;
          z-index: 1;
        }

        .stepDot {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(155, 0, 255, 0.25);
          border-radius: 999px;
          height: 8px;
          transition: all 0.2s;
          width: 28px;
        }

        .stepDot.active {
          background: linear-gradient(135deg, #d4af37, #9900ff);
          border-color: rgba(255, 245, 160, 0.65);
          box-shadow: 0 0 12px rgba(155, 0, 255, 0.45);
        }

        .otpInput {
          letter-spacing: 5px;
          text-align: center;
        }

        .ghostButton {
          background: transparent;
          border: 0;
          color: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          display: block;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          margin: 12px auto 0;
          padding: 0;
          position: relative;
          text-transform: uppercase;
          transition: color 0.2s;
          z-index: 1;
        }

        .ghostButton:hover:not(:disabled) {
          color: #cc66ff;
        }

        .ghostButton:disabled {
          color: rgba(255, 255, 255, 0.18);
          cursor: not-allowed;
        }

        .input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(155, 0, 255, 0.2);
          border-radius: 11px;
          color: #fff;
          font: inherit;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.5px;
          min-height: 46px;
          outline: none;
          padding: 12px 40px 12px 38px;
          transition: all 0.25s;
          width: 100%;
        }

        .input.withoutAction {
          padding-right: 14px;
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.22);
        }

        .input:focus {
          background: rgba(155, 0, 255, 0.07);
          border-color: rgba(155, 0, 255, 0.65);
          box-shadow:
            0 0 0 3px rgba(155, 0, 255, 0.12),
            0 0 18px rgba(155, 0, 255, 0.1);
        }

        .inputIcon,
        .iconButton svg {
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2;
        }

        .inputIcon {
          color: #9b44ff;
          filter: drop-shadow(0 0 4px rgba(155, 0, 255, 0.6));
          height: 15px;
          pointer-events: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
        }

        .inputIcon.left {
          left: 12px;
        }

        .iconButton {
          align-items: center;
          background: none;
          border: 0;
          color: rgba(255, 255, 255, 0.28);
          cursor: pointer;
          display: flex;
          height: 32px;
          justify-content: center;
          padding: 0;
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          transition: color 0.2s;
          width: 32px;
        }

        .iconButton:hover {
          color: #cc88ff;
        }

        .iconButton svg {
          height: 15px;
          width: 15px;
        }

        .divider {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(155, 0, 255, 0.4),
            rgba(212, 175, 55, 0.3),
            transparent
          );
          height: 1px;
          margin: 12px 0;
        }

        .checkList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .checkItem {
          align-items: flex-start;
          cursor: pointer;
          display: flex;
          gap: 8px;
        }

        .nativeCheckbox {
          height: 1px;
          opacity: 0;
          pointer-events: none;
          position: absolute;
          width: 1px;
        }

        .checkBox {
          align-items: center;
          background: rgba(155, 0, 255, 0.08);
          border: 1.5px solid rgba(155, 0, 255, 0.4);
          border-radius: 4px;
          display: flex;
          height: 16px;
          justify-content: center;
          margin-top: 2px;
          min-width: 16px;
          transition: all 0.2s;
          width: 16px;
        }

        .checkBox::after {
          color: #fff;
          content: "";
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
        }

        .nativeCheckbox:checked + .checkBox {
          background: linear-gradient(135deg, #6600cc, #9900ff);
          border-color: #9900ff;
          box-shadow: 0 0 8px rgba(155, 0, 255, 0.5);
        }

        .nativeCheckbox:checked + .checkBox::after {
          content: "✓";
        }

        .nativeCheckbox:focus-visible + .checkBox {
          outline: 2px solid rgba(204, 136, 255, 0.75);
          outline-offset: 2px;
        }

        .checkLabel {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          font-weight: 500;
          line-height: 1.4;
        }

        .submitButton {
          background: linear-gradient(
            135deg,
            #6600cc 0%,
            #9900ff 40%,
            #7700dd 70%,
            #5500aa 100%
          );
          border: 0;
          border-radius: 12px;
          box-shadow:
            0 0 25px rgba(136, 0, 255, 0.5),
            0 0 50px rgba(136, 0, 255, 0.18),
            0 4px 0 #330077,
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          color: #fff;
          cursor: pointer;
          font-size: 21px;
          font-weight: 700;
          letter-spacing: 3px;
          line-height: 1.2;
          margin-top: 4px;
          min-height: 52px;
          overflow: hidden;
          padding: 13px 0;
          position: relative;
          text-shadow: 0 0 10px rgba(220, 180, 255, 0.9);
          text-transform: uppercase;
          transition: all 0.18s;
          width: 100%;
        }

        .submitButton::before {
          animation: shimmer 2s linear infinite;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
        }

        .submitButton:hover:not(:disabled) {
          box-shadow:
            0 0 35px rgba(136, 0, 255, 0.65),
            0 0 70px rgba(136, 0, 255, 0.28),
            0 6px 0 #330077,
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .submitButton:active:not(:disabled) {
          box-shadow:
            0 0 20px rgba(136, 0, 255, 0.4),
            0 2px 0 #330077;
          transform: translateY(1px);
        }

        .submitButton:disabled {
          background: rgba(255, 255, 255, 0.06);
          box-shadow: none;
          color: rgba(255, 255, 255, 0.2);
          cursor: not-allowed;
        }

        .footerText {
          color: rgba(255, 255, 255, 0.35);
          font-size: 13px;
          line-height: 1.4;
          margin: 16px 0 0;
          position: relative;
          text-align: center;
          z-index: 1;
        }

        .footerLink {
          background: transparent;
          border: 0;
          color: #cc66ff;
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          padding: 0;
          text-shadow: 0 0 8px rgba(155, 0, 255, 0.5);
          transition: all 0.2s;
        }

        .footerLink:hover {
          color: #ee99ff;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes neonPulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }

          100% {
            background-position: 200% center;
          }
        }

        @keyframes chipFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-8deg);
          }

          50% {
            transform: translateY(-6px) rotate(-8deg);
          }
        }

        @keyframes chipFloatTwo {
          0%,
          100% {
            transform: translateY(0) rotate(12deg);
          }

          50% {
            transform: translateY(-8px) rotate(12deg);
          }
        }

        @keyframes borderGlow {
          0%,
          100% {
            opacity: 0.7;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes tabIn {
          from {
            opacity: 0;
            transform: translateX(12px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <style jsx global>{`
        .authCardShell .chip svg {
          fill: currentColor;
          height: 13px;
          width: 13px;
        }

        .authCardShell .chipTwo svg {
          height: 9px;
          width: 9px;
        }

        .authCardShell .diamondIcon {
          animation: authCardNeonPulse 2.5s ease-in-out infinite;
          fill: #b44fff;
          filter: drop-shadow(0 0 14px rgba(155, 0, 255, 0.9));
          height: 38px;
          margin-bottom: 6px;
          width: 38px;
        }

        .authCardShell .inputIcon,
        .authCardShell .iconButton svg {
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2;
        }

        .authCardShell .inputIcon {
          color: #9b44ff;
          filter: drop-shadow(0 0 4px rgba(155, 0, 255, 0.6));
          height: 15px;
          pointer-events: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
        }

        .authCardShell .inputIcon.left {
          left: 12px;
        }

        .authCardShell .iconButton svg {
          height: 15px;
          width: 15px;
        }

        @keyframes authCardNeonPulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
