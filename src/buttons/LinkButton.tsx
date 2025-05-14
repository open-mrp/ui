import Link from "next/link";
import React from "react";
import Button, { ButtonProps } from "./Button";

interface LinkButtonProps extends ButtonProps {
  href: string;
}

export default function LinkButton({
  href,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href}>
      <Button {...props}>{children}</Button>
    </Link>
  );
}
