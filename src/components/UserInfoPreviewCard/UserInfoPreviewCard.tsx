import React from 'react'
import Button from '../Button/Button'
import { MessageSquare } from 'lucide-react'

interface UserInfoPreviewCardProps {
    profileName: string | null;
    profilePicture: string | null;
    coverPicture: string | null; 
}

const UserInfoPreviewCard: React.FC<UserInfoPreviewCardProps> = ({
    profileName,
    profilePicture,
    coverPicture,
}) => {
    return (
        <div className="bg-neutral-50 w-[60vw] h-[95vh] ml-12 rounded-lg flex items-center justify-center">
            {/* Main Card */}
            <div className="bg-white w-[80%] h-[40%] rounded-md shadow-sm flex flex-col relative p-4">
                {/* Cover Image (Grey Box) */}
                <div
                    className="bg-neutral-100 w-full h-[70%] rounded-md shadow-sm flex items-center justify-center"
                    style={{
                        backgroundImage: `url(${coverPicture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                </div>

                {/* Profile Image */}
                <div
                    className="absolute bottom-8 left-16 bg-neutral-200 rounded-md shadow-sm w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                    style={{
                        backgroundImage: `url(${profilePicture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>

                {/* Profile Name & Button */}
                <div className="flex items-center justify-between w-full mt-2">
                    <p className="text-lg font-bold ml-40">{profileName}</p>
                    <Button variant="primary" className="text-sm px-4 py-1 flex items-center w-[auto]">
                        <MessageSquare size={16} className="mr-2" />
                        Have a Chat
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserInfoPreviewCard
