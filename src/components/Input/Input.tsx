"use client";

import React from 'react';
import FileUpload from '../FileUpload/FileUpload';

interface Input {
    name: string; // Input name
    label?: string; // Label text for the input
    type: string; // Input type (e.g., "text", "email", "password")
    value?: string; // Input value
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // OnChange event handler
    placeholder?: string; // Placeholder text (optional)
    required?: boolean; // Whether the input is required (optional)
}


const Input: React.FC<Input> = ({ name, label, type, value, onChange, placeholder, required }) => {
    return (
        <div>
            {/* Label */}
            <label htmlFor={name.toString()} className="block text-sm font-medium text-netural-600">
                {label}
            </label>

            {/* Input Field */}
            {type === 'file' ? (
                <FileUpload
                    name={name}
                    // value={value}
                    onChange={onChange}
                    required={required}
                />
            ) :
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="mt-1 block w-full px-3 py-3 border border-netural-200 rounded-sm shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
            }
        </div>
    );
};

export default Input;