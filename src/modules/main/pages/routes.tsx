import { RouteObject } from "react-router-dom";

import Home from "./home";
import MainLayout from "../layout/main-layout";
import Feeding from "./feeding";
import Financial from "./financial";
import Sport from "./sport";
import Vehicle from "./vehicle";
import TrainingMode from "./sport/training-mode";

export const MAIN_ROUTES: RouteObject[] = [
  {
    path: "",
    element: <MainLayout />,
    children: [
      { path: "home", Component: Home },
      { path: "sport", Component: Sport },
      { path: "sport/training-mode", Component: TrainingMode },

      { path: "vehicle", Component: Vehicle },
      { path: "feeding", Component: Feeding },
      { path: "financial", Component: Financial },
    ],
  },
];
