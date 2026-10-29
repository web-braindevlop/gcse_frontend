"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/feedback";
import { AuthRequestError, getCurrentUser, login, type LoginAudience } from "../services/auth.service";

type FieldErrors = { identifier?: string; password?: string };

export function LoginForm({ audience = "student" }: { audience?: LoginAudience }) {
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const identifier = String(data.get("identifier") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const nextErrors: FieldErrors = {};
    if (!identifier) nextErrors.identifier = "Enter your email or username.";
    if (!password) nextErrors.password = "Enter your password.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { user: signedInUser } = await login(identifier, password, audience);
      const { user: verifiedUser } = await getCurrentUser();
      if (verifiedUser.id !== signedInUser.id || verifiedUser.role !== signedInUser.role) {
        throw new AuthRequestError("Your sign-in could not be verified. Please try again.", 401);
      }
      toast.success("Welcome back", audience === "staff" ? "You’re signed in to your staff workspace." : "You’re signed in to your learning space.");
      router.replace(audience === "staff" ? "/staff/dashboard" : "/dashboard/overview");
    } catch (error) {
      toast.error("Sign-in failed", error instanceof Error ? error.message : "We could not sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <Input
        name="identifier"
        label="Email or username"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="you@school.com"
        error={errors.identifier}
        required
      />
      <Input
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password}
        required
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="grid size-9 place-items-center rounded-lg text-stone-500 transition-colors hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
          </button>
        }
      />

      <Button type="submit" variant="brand" size="lg" className="w-full" loading={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Log in"}
      </Button>
    </form>
  );
}


