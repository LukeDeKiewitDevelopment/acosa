import { ThemeToggle } from "./theme-toggle"

export type NavbarProps = {

}


export const Navbar = ({

}: NavbarProps) => {
return (
    <nav className="flex justify-between items-center px-8 py-4 bg-primary text-primary-foreground w-full">
    <h1>ACOSA LOGO*</h1>
    <ThemeToggle/>
    </nav>
)
}