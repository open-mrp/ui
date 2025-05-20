import { NavLink, NavSubSectionData } from "./types";

export interface NavSection {
  title: string;
  links: (NavLink | NavSubSectionData)[];
}

export interface SidenavProps {
  sections: NavSection[];
  renderNavItem: (item: NavLink | NavSubSectionData) => React.ReactNode;
  className?: string;
}

export default function Sidenav({
  sections,
  renderNavItem,
  className = "",
}: SidenavProps) {
  return (
    <nav
      className={`w-64 !bg-gray-900 h-[100vh] overflow-y-auto py-6 px-2 max-sm:hidden ${className}`}
    >
      {sections.map((section, index) => (
        <div
          key={section.title}
          className={`pb-2 ${
            index < sections.length - 1 ? "border-b border-gray-700" : ""
          }`}
        >
          <h3
            className="mx-2 text-gray-100 mb-3 flex items-center"
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {section.title.toUpperCase()}
          </h3>
          <div className="flex flex-col gap-2">
            {section.links.map(renderNavItem)}
          </div>
        </div>
      ))}
    </nav>
  );
}
