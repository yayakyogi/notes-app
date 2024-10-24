import React from "react";
import { Form } from "rsuite";

export interface TypeProps {
  id: number;
  name: string;
}

export interface NoteProps {
  title: string;
  content: string;
  types: TypeProps[];
  id?: number;
  createdAt?: string;
}

const TextField = React.forwardRef((props: any, ref: any) => {
  const { name, label, accepter, ...rest } = props;

  return (
    <Form.Group ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});

export default TextField;
