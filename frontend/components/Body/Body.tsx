import { createContext } from "react";
import { BodyData } from "../../models/Body";

export const BodyDataContext = createContext<BodyData | undefined>(undefined)
