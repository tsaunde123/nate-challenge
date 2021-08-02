import React from "react";
import cx from "classnames";

interface IContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: IContainerProps) {
  return (
    <div className={cx("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
