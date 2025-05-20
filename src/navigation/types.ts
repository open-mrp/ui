export interface NavLink {
  href: string;
  children: string;
}

export interface NavSubSectionData {
  title: string;
  items: (NavLink | NavSubSectionData)[];
}
