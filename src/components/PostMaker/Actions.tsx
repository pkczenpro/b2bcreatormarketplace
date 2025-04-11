
import React from 'react';
import { Button } from "antd";

const Actions = ({ setIsModalVisible, publishToLinkedIn }) => (
    <div className="flex justify-between items-end mt-auto">
        <span className="text-sm text-neutral-500">Saved at 12:48 PM</span>
        <div className="flex space-x-2">
            {/* <Button icon={<Clock size={16} />} onClick={() => setIsModalVisible(true)}>
                Schedule Post
            </Button> */}
            <Button type="primary" className="bg-primary-700" onClick={publishToLinkedIn}>
                Publish to LinkedIn
            </Button>
        </div>
    </div>
);


export default Actions;