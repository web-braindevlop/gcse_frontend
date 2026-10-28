import { ButtonLink } from "@/components/ui";
import { TopNavigation, type NavigationItem } from "./top-navigation";

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Subjects", href: "/#subjects" },
  { label: "Features", href: "/#features" },
];

export function SiteHeader() {
  return (
    <TopNavigation
      items={navigationItems}
      actions={
        <ButtonLink href="/login/student" variant="brand" size="md">
          Student log in
        </ButtonLink>
      }
    />
  );
}

