export type HeaderProps = {
  logo?: string;
  logoAlt?: string;
  logoDark?: string;
  logoDarkAlt?: string;
};

export const Header = ({
  logo,
  logoAlt,
  logoDark,
  logoDarkAlt,
  ...props
}: HeaderProps) => {
  return (
    <header
      data-slot="header"
      className="bg-card text-card-foreground sticky top-0 left-0 z-50 border-b-2 px-4 py-1 md:px-6 lg:px-8"
      {...props}
    >
      <div className="flex items-center justify-between gap-4"></div>
    </header>
  );
};
