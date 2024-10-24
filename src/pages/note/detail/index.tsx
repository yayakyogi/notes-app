import { TypeProps } from "@components/ui/texfield/textfield.component";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Drawer } from "rsuite";

const NoteDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(true);

  const onClose = () => setOpen(false);
  const handleExited = () => navigate("/");

  const {
    data: note,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["detail"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/notes/${params.id}`
      );

      return data.data;
    },
  });

  return (
    <Drawer open={open} size="sm" onClose={onClose} onExited={handleExited}>
      <Drawer.Header>
        <Drawer.Title className="text-2xl font-bold">Detail Note</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        {isPending && <div>Loading</div>}
        {isSuccess && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate">
                Created: {new Date(note.createdAt).toDateString()}
              </span>
              <Button
                appearance="ghost"
                size="xs"
                onClick={() => navigate("update")}
              >
                Update
              </Button>
            </div>
            <h4 className="mt-3">{note.title}</h4>
            <p>{note.content}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {note.types.map((type: TypeProps) => {
                return (
                  <div
                    key={type.id}
                    className="py-1 px-2 rounded-full bg-amber text-xs"
                  >
                    {type.name}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Drawer.Body>
    </Drawer>
  );
};

export default NoteDetailPage;
