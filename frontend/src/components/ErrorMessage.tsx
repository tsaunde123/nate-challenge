import React from "react";
import "./ErrorMessage.css";

export default function ErrorMessage({ message }: { message: string }) {
  return <p className="error">{message}</p>;
}
