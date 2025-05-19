"use client";

import { cn } from "@/utils/cn";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  crumbs: Breadcrumb[];
  className?: string;
  renderLink?: (crumb: Breadcrumb) => React.ReactNode;
  renderSeparator?: () => React.ReactNode;
}

export default function Breadcrumbs({
  crumbs,
  className,
  renderLink = (crumb) => (
    <a href={crumb.href} className="text-sm">
      {crumb.label}
    </a>
  ),
  renderSeparator = () => <span className="mx-2 text-text-secondary">/</span>,
}: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)}>
      <div className="flex items-center">
        {crumbs.map((crumb, index) => {
          return (
            <div key={index + crumb.label} className="flex items-center">
              {crumb.href ? (
                renderLink(crumb)
              ) : (
                <div className="text-sm text-text-secondary">{crumb.label}</div>
              )}
              {index < crumbs.length - 1 && renderSeparator()}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
