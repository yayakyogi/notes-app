import FormNote from "@components/form-note/form-note.component";
import { NoteProps } from "@components/ui/texfield/textfield.component";
import { useToast } from "@hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Drawer } from "rsuite";

const NoteUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const toast = useToast();
  const [open, setOpen] = useState<boolean>(true);

  const onClose = () => setOpen(false);
  const handleExited = () => navigate("/");

  const {
    data: note,
    isPending: loadingGetNote,
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

  const { mutate, isPending: loadingSubmit } = useMutation({
    mutationFn: (data) => {
      return axios.put(`http://localhost:3000/notes/${params.id}`, data);
    },
    onSuccess: () => {
      navigate("/", { replace: true, state: "updated" });
      toast.show("success", "Note updated successfully");
    },
    onError: (error) => {
      toast.show("error", error.message);
    },
  });

  return (
    <Drawer
      open={open}
      size="sm"
      backdrop="static"
      onClose={onClose}
      onExited={handleExited}
    >
      <Drawer.Header>
        <Drawer.Title className="text-2xl font-bold">Update Note</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        {loadingGetNote && <div>Loading...</div>}
        {isSuccess && (
          <FormNote
            loading={loadingSubmit}
            note={note}
            callback={(note: NoteProps) => mutate(note as any)}
          />
        )}
      </Drawer.Body>
    </Drawer>
  );
};

export default NoteUpdatePage;
