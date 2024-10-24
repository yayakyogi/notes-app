import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "rsuite";

interface ContentProps {
  id: number;
  message: string;
}

interface FuncProps {
  open: (data: ContentProps) => void;
}

interface IProps {
  callback: (id: number) => void;
  loading: boolean;
}

const ModalConfirm: React.ForwardRefRenderFunction<FuncProps, IProps> = (
  { callback, loading },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<ContentProps>();

  useImperativeHandle(ref, () => ({
    open(value: ContentProps) {
      setOpen(true);
      setType(value);
    },
  }));

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Modal size="xs" open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>{type?.message}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          appearance="primary"
          color="red"
          loading={loading}
          disabled={loading}
          onClick={() => {
            callback(type?.id || 0);
            onClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default forwardRef(ModalConfirm);
