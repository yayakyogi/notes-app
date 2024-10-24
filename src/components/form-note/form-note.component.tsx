import TextField, {
  NoteProps,
  TypeProps,
} from "@components/ui/texfield/textfield.component";
import Textarea from "@components/ui/textarea/textarea.component";
import { useToast } from "@hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Button, Divider, Form, Schema, TagPicker } from "rsuite";

interface FormProps {
  note?: NoteProps;
  loading: boolean;
  callback: (val: NoteProps) => void;
}

const FormNote: React.FC<FormProps> = ({ note, loading, callback }) => {
  const [isAddType, setisAddType] = useState<boolean>(false);
  const toast = useToast();
  // const [types, setTypes] = useState<any[]>();

  const formNoteRef = useRef<any>(null);
  const formTypeRef = useRef<any>(null);

  // const [_, setFormError] = useState({});
  const [formType, setFormType] = useState<any>({ name: "" });
  const [formValue, setFormValue] = useState<any>({
    title: note?.title || "",
    content: note?.content || "",
    types: note?.types.map((note) => note.id) || [], // get the id to set default value
  });

  const { StringType, ArrayType } = Schema.Types;

  const modelNote = Schema.Model({
    title: StringType().isRequired(),
    content: StringType().isRequired().minLength(10, "Min 10 Caracters"),
    types: ArrayType().minLength(1, "Please select min 1 type"),
  });

  const modelType = Schema.Model({
    name: StringType().isRequired(),
  });

  // Get Types
  const {
    data: types,
    isPending: pendingGetTypes,
    refetch,
  } = useQuery({
    queryKey: ["type"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/types");

      return data.data;
    },
  });

  // Mutation type
  const { mutate } = useMutation({
    mutationFn: async (data) => {
      return await axios.post("http://localhost:3000/types", data);
    },
    onSuccess: () => {
      toast.show("success", "Type created successfully");
      refetch();
    },
  });

  const handleSubmitNote = () => {
    if (!formNoteRef.current.check()) {
      return;
    }

    callback(formValue);
  };

  const handleSubmitType = () => {
    if (!formTypeRef.current.check()) {
      return;
    }

    mutate(formType);
    setisAddType(false);
  };

  return (
    <>
      <Form
        fluid
        ref={formNoteRef}
        formValue={formValue}
        onChange={setFormValue}
        model={modelNote}
      >
        <TextField label="Title" name="title" />
        <TextField
          label="Content"
          name="content"
          rows={3}
          accepter={Textarea}
        />
        <TextField
          label="Types"
          name="types"
          accepter={TagPicker}
          block
          loading={pendingGetTypes}
          data={types?.map((type: TypeProps) => ({
            value: type.id,
            label: type.name,
          }))}
          defaultValue={note?.types.map((val) => val.id)}
        />
        <Form.Group>
          <Button
            appearance="primary"
            block
            className="mb-1"
            onClick={handleSubmitNote}
          >
            Save Note
          </Button>
          <Button
            appearance="ghost"
            color={isAddType ? "red" : "blue"}
            block
            onClick={() => setisAddType(!isAddType)}
          >
            {isAddType ? "Cancel" : "Add New Types"}
          </Button>
        </Form.Group>
      </Form>
      {isAddType && (
        <Form
          fluid
          ref={formTypeRef}
          formValue={formType}
          onChange={setFormType}
          model={modelType}
        >
          <Divider />
          <TextField label="Type" name="name" />
          <Form.Group>
            <Button
              appearance="primary"
              className="mt-5"
              onClick={handleSubmitType}
              block
              disabled={loading}
              loading={loading}
            >
              Save New Type
            </Button>
          </Form.Group>
        </Form>
      )}
    </>
  );
};

export default FormNote;
