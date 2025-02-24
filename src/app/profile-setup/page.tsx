'use client';

import { useState } from 'react';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import UserInfoPreviewCard from '@/components/UserInfoPreviewCard/UserInfoPreviewCard';

type ProfileSetupProps = object

export default function ProfileSetup({ }: ProfileSetupProps) {
    const [profileName, setProfileName] = useState<string>('Andrew Bishop');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [coverPicture, setCoverPicture] = useState<string | null>(null);
    // links
    const [linkedin, setLinkedin] = useState<string>('linkedin.com/in/johndoe');
    const [medium, setMedium] = useState<string>('medium.com/@johndoe');
    const [spotify, setSpotify] = useState<string>('open.spotify.com/user/johndoe');
    const [website, setWebsite] = useState<string>('johndoe.com');
    const [otherLinks, setOtherLinks] = useState<string>('');
    const [openOtherLinks, setOpenOtherLinks] = useState<boolean>(false);

    // info
    const [shortIntroduction, setShortIntroduction] = useState('');
    const [tags, setTags] = useState('');

    const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setProfilePicture(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleCoverPictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCoverPicture(URL.createObjectURL(event.target.files[0]));
        }
    };
    const [activeId, setActiveId] = useState(2);
    const sections = [
        {
            id: 1,
            content:
                <div>
                    <h1 className="text-h5 font-bold text-left mb-1">
                        Profile Name
                    </h1>
                    <p className="text-neutral-600 text-left mb-6">
                        Change your profile name if it differs from your previously entered full name.
                    </p>
                    <div className='w-[70%]'>
                        <Input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Andrew Bishop"
                            required
                            name="profileName"

                        />
                    </div>
                    <h1 className="text-h5 font-bold text-left mb-1 mt-10">
                        Profile Picture
                    </h1>
                    <p className="text-neutral-600 text-left mb-6">
                        Select a profile picture for your account. Your profile picture is key to establishing trust and authenticity with the brand.
                    </p>
                    <div className='w-[70%]'>
                        <Input
                            type="file"
                            required
                            name="profilePicture"
                            onChange={handleProfilePictureUpload}
                            value={profilePicture || ''}
                        />
                    </div>
                    <h1 className="text-h5 font-bold text-left mb-1 mt-10">
                        Cover Picture
                    </h1>
                    <p className="text-neutral-600 text-left mb-6">
                        Your cover photo speaks volumes about you—make sure it speaks the right message.
                    </p>
                    <div className='w-[70%]'>
                        <Input
                            type="file"
                            value={coverPicture || ''}
                            onChange={handleCoverPictureUpload}
                            required
                            name="coverPicture"
                        />
                    </div>
                </div>,
        },
        {
            id: 2,
            content: <>
                <h1 className="text-h5 font-bold text-left mb-1">
                    Social Links
                </h1>
                <p className="text-neutral-600 text-left mb-6">
                    Give your potential clients a chance to see your work by providing them with a window to your social media.
                </p>
                <form className='space-y-4 w-[70%]'>
                    <Input
                        label='LinkedIn'
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                        required
                        name="linkedin"
                    />
                    <Input
                        label='Medium'
                        type="text"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        placeholder="medium.com/@johndoe"
                        required
                        name="medium"
                    />
                    <Input
                        label='Spotify'
                        type="text"
                        value={spotify}
                        onChange={(e) => setSpotify(e.target.value)}
                        placeholder="open.spotify.com/user/johndoe"
                        required
                        name="spotify"
                    />
                    <Input
                        label='Website'
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="johndoe.com"
                        required
                        name="website"
                    />
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenOtherLinks(!openOtherLinks)}>
                        <Plus
                            size={20}
                            className="text-primary-700"
                        />
                        <p className="text-primary-700 font-medium">
                            Add more
                        </p>
                    </div>
                    {openOtherLinks &&
                        <Input
                            label='Other Links'
                            type="text"
                            value={otherLinks}
                            onChange={(e) => setOtherLinks(e.target.value)}
                            placeholder=""
                            required
                            name="otherLinks"
                        />
                    }
                </form>
            </>,
        },
        {
            id: 3,
            content: <>
                <h1 className="text-h5 font-bold text-left mb-1">
                    Short Introduction
                </h1>
                <p className="text-neutral-600 text-left mb-6">
                    Share a little bit about yourself and what you can provide for the brands.
                </p>
                <textarea
                    className="w-full h-32 p-2 border border-neutral-200 rounded-lg min-h-[200px] mb-4"
                    placeholder="I am a content creator with a passion for creating engaging content for brands. I specialize in creating video content and have worked with several brands to help them reach their target audience."
                    value={shortIntroduction}
                    onChange={(e) => setShortIntroduction(e.target.value)}
                />

                <Input
                    label='Add Relavant Tags'
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add Tags"
                    required
                    name="tags"
                />

            </>,
        }
    ]

    return (
        <div className="max-h-screen flex items-center justify-center bg-white p-6">
            <div className="ml-24 w-[40vw]">
                <h1 className="text-h3 font-bold text-left mb-1">
                    Setup Your Profile
                </h1>
                <p className="text-neutral-600 text-left mb-10">
                    Welcome to B2B Creator! Let’s get a head start on your profile.
                </p>

                {sections.filter((item) => item.id === activeId).map((section) => (
                    <div key={section.id} className="mb-10">
                        {section.content}
                    </div>
                ))}

                <div className="flex items-end justify-end flex-row">
                    {activeId > 1 && <Button variant="outline" className="w-auto mt-8 px-12" socialMediaIcon={<ArrowLeft />} onClick={() => {
                        if (activeId > 1) {
                            setActiveId(activeId - 1);
                        }
                    }}>
                        Go Back
                    </Button>}
                    {activeId < sections.length && <Button variant="primary" className="w-auto mt-8 px-12 ml-4" icon={<ArrowRight />} onClick={() => {
                        setActiveId(activeId + 1);
                    }}>
                        Continue
                    </Button>}
                    {activeId === sections.length && <Button variant="primary" className="w-auto mt-8 px-12 ml-4" icon={<ArrowRight />} onClick={() => {
                        console.log('submit');
                    }
                    }>
                        Finish Setting Up
                    </Button>}

                </div>
            </div>
            <UserInfoPreviewCard profileName={profileName} profilePicture={profilePicture} coverPicture={coverPicture} />
        </div>
    );


}

