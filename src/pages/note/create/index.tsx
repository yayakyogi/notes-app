import FormNote from "@components/form-note/form-note.component";
import { NoteProps } from "@components/ui/texfield/textfield.component";
import { useToast } from "@hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "rsuite";

const NoteCreatePage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);

  const onClose = () => setOpen(false);
  const handleExited = () => navigate("/", { replace: true });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return axios.post("http://localhost:3000/notes", data);
    },
    onSuccess: () => {
      toast.show("success", "Note created successfully");
      navigate("/", { replace: true, state: "created" });
    },
    onError: (error) => {
      toast.show("error", error.message);
    },
  });

  const handleSubmit = (val: NoteProps) => {
    mutate(val as any);
  };

  return (
    <Drawer
      open={open}
      size="sm"
      backdrop="static"
      onClose={onClose}
      onExited={handleExited}
    >
      <Drawer.Header>
        <div className="flex flex-col">
          <Drawer.Title className="text-2xl font-bold">
            Create New Note
          </Drawer.Title>
          <span>Fill in the form below to create your new data note</span>
        </div>
      </Drawer.Header>
      <Drawer.Body>
        <FormNote
          loading={isPending}
          callback={(val) => {
            handleSubmit(val);
            // toast.show("Successfully created note");
            // onClose();
          }}
        />
      </Drawer.Body>
    </Drawer>
  );
};

export default NoteCreatePage;
