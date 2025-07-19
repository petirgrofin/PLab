import { useEffect } from "react";

const useAutoScrollToCurrent = (refs, shownIndex) => {
  useEffect(() => {
    if (refs.current[shownIndex]) {
      refs.current[shownIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [refs, shownIndex]);
};

export default useAutoScrollToCurrent;
