import { ReactNode } from "react";

export interface SupportLink {
  icon: ReactNode;
  text: string;
  link: {
    text: string;
    href: string;
  };
}

export interface FooterProps {
  home: {
    icon: ReactNode;
    href: string;
  };
  supportLinks: SupportLink[];
  renderLink?: (props: { href: string; children: ReactNode }) => ReactNode;
}

export default function Footer({
  home,
  supportLinks,
  renderLink = (props) => <a href={props.href}>{props.children}</a>,
}: FooterProps) {
  return (
    <footer className="border-t border-[var(--text-secondary)]/20 mt-24">
      <div className="py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {renderLink({ href: home.href, children: home.icon })}
          </div>
          <div className="flex flex-col items-end">
            {supportLinks.map((link, index) => (
              <p
                key={index}
                className={`flex items-center ${
                  index > 0 ? "mt-2" : ""
                } !text-xs`}
              >
                {link.icon}
                {link.text}{" "}
                {renderLink({
                  href: link.link.href,
                  children: (
                    <span className="text-blue-500 ml-1 !text-xs">
                      {link.link.text}
                    </span>
                  ),
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
