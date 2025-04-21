import PostEditor from "./PostEditor";
import PostPreview from "./PostPreview";
import { Button } from "antd";
import { FileText, Save } from "lucide-react";

const MainContent = ({
    postContent,
    setPostContent,
    handleTextFormatting,
    handleImageUpload,
    relatedCampaigns,
    selectedCampaign,
    setSelectedCampaign,
    userData,
    publishToLinkedIn,
    setIsModalVisible,
    imagePreview,
    isReadMore,
    setIsReadMore,
    isSelectSharingModalOpen,
    setIsSelectSharingModalOpen,
    setIsDraftModalOpen,
    saveDraftToLocalStorage,
    loading
}) => (
    <div className="flex flex-col md:flex-row w-[90%] mt-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 sm:min-h-[80vh] bg-white p-6 rounded-md shadow-md">
        <div className="max-w-[50%] w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold"></h2>
                <div>
                    <Button
                        icon={<FileText size={16} />}
                        onClick={() => setIsDraftModalOpen(true)}
                        style={{ marginRight: "10px" }}

                    >
                        Load Draft
                    </Button>
                    <Button
                        icon={<Save size={16} />}
                        onClick={() => {
                            saveDraftToLocalStorage();
                        }}
                        className="bg-blue-500 text-white"
                    >
                        Save Draft
                    </Button>

                </div>
            </div>

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
                isSelectSharingModalOpen={isSelectSharingModalOpen}
                setIsSelectSharingModalOpen={setIsSelectSharingModalOpen}
                publishLoading={loading}
            />
        </div>
        <div className="max-w-[50%] w-full">
            <PostPreview userData={userData} postContent={postContent} imagePreview={imagePreview} isReadMore={isReadMore} setIsReadMore={setIsReadMore} />
        </div>
    </div>
);


export default MainContent;