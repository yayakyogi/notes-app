import React, { useState } from "react";
import {
  ButtonGroup,
  Button,
  Whisper,
  Popover,
  Dropdown,
  IconButton,
} from "rsuite";
import { TypeProps } from "../texfield/textfield.component";

const SplitButton: React.FC<{ types: TypeProps[] }> = ({ types }) => {
  const [action, setAction] = useState(0);

  return (
    <ButtonGroup>
      <Button appearance="primary" color="green">
        {`Type : ${types[action].name}`}
      </Button>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          const handleSelect = (eventKey: any) => {
            onClose();
            setAction(eventKey);
            console.log(eventKey);
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                {types.map((type) => (
                  <Dropdown.Item key={type.id} eventKey={type.id}>
                    {type.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <IconButton
          appearance="primary"
          color="green"
          icon={<div className="i-mdi:chevron-down text-base" />}
        />
      </Whisper>
    </ButtonGroup>
  );
};

export default SplitButton;
