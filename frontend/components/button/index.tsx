import classNames from "classnames";
import React from "react";

type ButtonT = "button" | "a";

interface IButtonProps {
  as: ButtonT;
  className?: string;
  [prop: string]: any;
}

export default function Button({ as, className, ...props }: IButtonProps) {
  const ButtonType: ButtonT = "button" || "a";
  return <ButtonType className={classNames("", className)} {...props} />;
}
