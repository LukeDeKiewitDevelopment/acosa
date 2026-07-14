import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { ArrowUp } from "lucide-react";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 600) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const backtoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Button
      data-slot="back-to-top"
      size={"icon-lg"}
      disabled={!isVisible}
      aria-hidden={!isVisible}
      onClick={backtoTop}
      className={clsx(
        "animate-in fade-in zoom-in fixed right-8 bottom-8 z-9999 border-none shadow-md shadow-black/40 duration-200 not-dark:bg-secondary not-dark:text-secondary-foreground",
        !isVisible && "pointer-events-none! -z-50! opacity-0!",
      )}
    >
      <ArrowUp  />
      <span className="sr-only">Scroll back to top</span>
    </Button>
  );
};
