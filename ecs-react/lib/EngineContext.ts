import { Engine } from "@niloc/ecs";
import { createContext } from "react";

export const EngineContext = createContext<{ engine: Engine }>({ engine: new Engine() })