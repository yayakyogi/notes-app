import React from "react";
import { Message, useToaster } from "rsuite";

export const useToast = () => {
  const toaster = useToaster();

  const show = (type: "success" | "error", message: string) => {
    toaster.push(
      React.createElement(
        Message,
        {
          showIcon: true,
          type,
        },
        message
      ),
      { placement: "topEnd", duration: 3000 }
    );
  };

  return { show };
};
