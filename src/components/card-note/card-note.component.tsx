import React from "react";
import { Divider, IconButton, Tooltip, Whisper } from "rsuite";
import style from "./card-note.module.less";
import { TypeProps } from "@components/ui/texfield/textfield.component";

interface Props {
  date: string;
  types: TypeProps[];
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
  onDetail: () => void;
}

const CardNote: React.FC<Props> = ({
  date,
  title,
  types,
  content,
  onDelete,
  onEdit,
  onDetail,
}) => {
  return (
    <div className="bg-white flex flex-col rounded-lg p-3 shadow">
      {/* Content */}
      <h6 className="text-lg text-black">{title}</h6>
      <p className={style.content}>{content}</p>
      <div className="flex flex-wrap">
        {types.map((type) => {
          return (
            <div
              key={type.id}
              className="py-1 px-2 bg-[#2589f4] text-white font-500 rounded-full text-xs"
            >
              {type.name}
            </div>
          );
        })}
      </div>
      <Divider className="my-4" />
      <div className="flex items-center justify-end gap-2">
        <div className="text-xs flex-1">{date}</div>
        <Whisper placement="bottom" speaker={<Tooltip>Edit</Tooltip>}>
          <IconButton
            appearance="ghost"
            size="xs"
            icon={<div className="i-mdi:pencil text-lg" />}
            onClick={() => onEdit()}
          />
        </Whisper>
        <Whisper placement="bottom" speaker={<Tooltip>Delete</Tooltip>}>
          <IconButton
            appearance="ghost"
            size="xs"
            color="red"
            onClick={() => onDelete()}
            icon={<div className="i-mdi:trash text-lg" />}
          />
        </Whisper>
        <Whisper placement="bottom" speaker={<Tooltip>Detail</Tooltip>}>
          <IconButton
            appearance="ghost"
            size="xs"
            color="green"
            onClick={() => onDetail()}
            icon={<div className="i-mdi:eye text-lg" />}
          />
        </Whisper>
      </div>
    </div>
  );
};

export default CardNote;
