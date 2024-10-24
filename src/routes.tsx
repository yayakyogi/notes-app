import HomePage from "@pages/note";
import NoteCreatePage from "@pages/note/create";
import NoteDetailPage from "@pages/note/detail";
import NoteUpdatePage from "@pages/note/update";
import { RouteObject } from "react-router-dom";

export default [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "create",
        element: <NoteCreatePage />,
      },
      {
        path: ":id",
        element: <NoteDetailPage />,
      },
      {
        path: ":id/update",
        element: <NoteUpdatePage />,
      },
    ],
  },
] as RouteObject[];
