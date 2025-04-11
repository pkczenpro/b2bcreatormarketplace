import React from 'react';
import LinkedInPostFormatter from './LinkedInPostFormatter';
import { Image } from 'lucide-react';

const Toolbar = ({ handleTextFormatting, handleImageUpload }) => {
    return (
        <div className="flex space-x-4 mb-4">
            <LinkedInPostFormatter />
            <label className="cursor-pointer">
                <Image size={20} />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
        </div>
    )
}

export default Toolbar;