import { Framework } from "@niloc/core";
import { createContext } from "react";

export const AppContext = createContext<{ framework: Framework }>({
    framework: null as unknown as Framework
})