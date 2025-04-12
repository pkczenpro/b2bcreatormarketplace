import React from 'react';
import CustomImage from '../CustomImage';
import { Ellipsis } from 'lucide-react';


const UserInfo = ({ userData }) => {
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
                <CustomImage loading="lazy" src={userData?.profileImage} alt="Profile" className="w-8 h-8 rounded-full" />
                <div>
                    <h1 className="text-sm font-medium">{userData?.name}</h1>
                    <p className="text-xs text-neutral-500">325 followers</p>
                </div>
            </div>
            <Ellipsis size={20} />
        </div>
    )
};

export default UserInfo;