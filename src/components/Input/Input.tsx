"use client";

import React from "react";
import FileUpload from "../FileUpload/FileUpload";

interface Input {
  name?: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  size?: "small" | "medium" | "large";
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

const Input: React.FC<Input> = ({
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  size = "medium",
  multiple,
  maxFiles,
  onKeyDown,
  onKeyPress,
  className,
}) => {
  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg",
  };

  return (
    <div>
      <label
        htmlFor={name?.toString()}
        className="block text-sm font-medium text-neutral-600"
      >
        {label}
      </label>
      {type === "file" ? (
        <FileUpload
          name={name}
          onChange={onChange}
          required={required}
          multiple={multiple}
          maxFiles={maxFiles}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onKeyDown={onKeyDown}
          onKeyPress={onKeyPress}
          className={`${className} mt-1 block w-full border border-neutral-200 rounded-sm shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${sizeClasses[size]}`}
        />
      )}
    </div>
  );
};

export default Input;
