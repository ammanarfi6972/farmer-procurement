"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function SignOutButton() {
  const { t } = useLanguage();
  return <span className="hidden md:inline">{t("nav.signout")}</span>;
}
