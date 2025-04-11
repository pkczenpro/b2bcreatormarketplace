import React from 'react';
import UserInfo from './UserInfo';
import PostContent from './PostContent';


const PostPreview = ({ userData, postContent, imagePreview, isReadMore, setIsReadMore }) => (
    <div className="flex flex-col w-full md:w-1/2 px-4 py-4 h-full">
        <div className="p-6 rounded-md min-h-[30vh] flex-grow bg-neutral-50">
            <div className="p-6 flex flex-col justify-between min-h-[50%] max-h-[100%] bg-white rounded-md shadow-md">
                <UserInfo userData={userData} />
                <PostContent postContent={postContent} isReadMore={isReadMore} setIsReadMore={setIsReadMore} imagePreview={imagePreview} />
            </div>
        </div>
    </div>
);

export default PostPreview;