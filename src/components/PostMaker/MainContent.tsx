import PostEditor from "./PostEditor";
import PostPreview from "./PostPreview";

const MainContent = ({ postContent, setPostContent, handleTextFormatting, handleImageUpload, relatedCampaigns, selectedCampaign, setSelectedCampaign, userData, publishToLinkedIn, setIsModalVisible, imagePreview, isReadMore, setIsReadMore }) => (
    <div className="flex flex-col md:flex-row w-[90%] mt-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 sm:min-h-[80vh] bg-white p-6 rounded-md shadow-md">
        <PostEditor
            postContent={postContent}
            setPostContent={setPostContent}
            handleTextFormatting={handleTextFormatting}
            handleImageUpload={handleImageUpload}
            relatedCampaigns={relatedCampaigns}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            publishToLinkedIn={publishToLinkedIn}
            setIsModalVisible={setIsModalVisible}
        />
        <PostPreview userData={userData} postContent={postContent} imagePreview={imagePreview} isReadMore={isReadMore} setIsReadMore={setIsReadMore} />
    </div>
);


export default MainContent;