import { useEffect } from "react";

// Setting a small delay (even 1ms) solves all of the problems for some reason. I think that other components
// have to finish their tasks completely before the scroll happens, otherwise it gets cancelled or doesn't work
// correctly. It's incredibly hackish, but it will do for now (also, setting a delay looks cool).
const useAutoScrollToCurrent = (refs, shownIndex, delay = 50) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (refs.current[shownIndex]) {
        refs.current[shownIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, delay); 

    return () => clearTimeout(timeoutId); // Cleanup in case the component unmounts early
  }, [refs, shownIndex, delay]);
};

export default useAutoScrollToCurrent;