import { createContext, useContext } from "react";

export const ComponentContext = createContext();

export const useComponentContext = () => useContext(ComponentContext);
