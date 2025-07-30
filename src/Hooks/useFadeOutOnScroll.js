import { useEffect } from "react";
import useScrollDirection from "./useScrollDirection";

const useFadeOutOnScroll = (refs, shownIndex) => {
  const scrollDir = useScrollDirection();

  useEffect(() => {

    const handleScroll = () => {

      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();

        if (shownIndex > i) {
          if (scrollDir === "up" && rect.bottom > 0) {
            el.classList.remove("opacity-0");
          } else if (scrollDir === "down" && rect.bottom < window.innerHeight / 2) {
            el.classList.add("opacity-0");
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [refs, scrollDir, shownIndex]);
};

export default useFadeOutOnScroll;

