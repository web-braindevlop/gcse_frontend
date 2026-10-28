import type { ReactNode } from "react";

export type NavigationItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type TopNavigationProps = {
  items: NavigationItem[];
  brandLabel?: string;
  brandHref?: string;
  navigationLabel?: string;
  actions?: ReactNode;
  className?: string;
};
