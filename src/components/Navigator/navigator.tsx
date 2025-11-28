"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { rating_url } from "@/constants";
import { useViewport } from "@/contexts/viewportContext";
import { HEADER_NOODLE_ICON_REMOVE_BG } from "@/images";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "../Link";
import { Skeleton } from "../ui/skeleton";
import { MobileNavigator } from "./Mobile";
import "./style.css";

const menu: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const leftComp: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const rightComp: { title: string; href: string; description: string }[] = [];

const title = "Hủ tiếu ngọc mai";

interface IProps {
  classes?: string;
}

export function Navigator({ classes }: IProps) {
  const { viewportWidth, isCalculating } = useViewport();
  const [isSticky, setSticky] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 80);
    };

    if (!classes) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  if (isCalculating) {
    return (
      <Skeleton className="h-[120px] w-full bg-[rgba(0,0,0,0.4)] rounded-none" />
    );
  }

  if (viewportWidth <= 640) {
    return <MobileNavigator />;
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-[5rem] justify-center mx-auto transition-all",
        isSticky
          ? "fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-[1000] w-full"
          : "",
        classes
      )}
      style={{ minHeight: "10vh" }}
    >
      <LeftNavigator />
      <div className="bg-white rounded-full">
        <Link href="/">
          <img
            src={HEADER_NOODLE_ICON_REMOVE_BG}
            alt="header icon"
            width={120}
            height={80}
          />
        </Link>
      </div>
      <RightNavigator />
    </div>
  );
}

const LeftNavigator = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-8">
        <NavigationMenuItem>
          <Link href="/menus">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Thực đơn (Menu)
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about-us">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Về chúng tôi
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const RightNavigator = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-8">
        <NavigationMenuItem className="shadow-sm bg-[rgba(255,255,255,0.2)] rounded-lg text-center min-w-[130px]">
          <Link href="/contact">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Liên hệ
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="shadow-sm bg-[rgba(255,255,255,0.2)] rounded-lg text-center min-w-[130px]">
          <Link href={rating_url} target="_blank">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Góp ý
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
