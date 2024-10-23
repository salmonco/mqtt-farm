// import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import FarmListPage from "@pages/FarmList";
import FarmPage from "@pages/Farm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FarmListPage />,
  },
  {
    path: "/farm",
    element: <FarmPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
