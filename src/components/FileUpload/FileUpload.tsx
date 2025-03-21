import React, { useState } from 'react';

interface FileUploadProps {
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ name, onChange, required, multiple }) => {
    const [dragOver, setDragOver] = useState<boolean>(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Trigger the onChange function with the files.
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onChange && onChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div
            className={`shadow-sm border border-dashed border-gray-300 rounded-sm p-4 flex flex-row items-center text-gray-600 ${dragOver ? 'border-primary-700' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <svg className="w-8 h-8 mr-2 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"></path>
            </svg>
            <div>
                <p className="text-sm">Drag and drop or {" "}
                    <label htmlFor={name} className="text-primary-700 font-bold cursor-pointer">Choose file</label>
                </p>
                <p className="text-xs text-gray-400">Max file size: 5MB</p>
                <input
                    multiple={multiple}
                    id={name}
                    type="file"
                    name={name}
                    onChange={onChange}
                    required={required}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default FileUpload;
