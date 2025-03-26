import React from "react";
import Button from "../Button/Button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface ProfileCardPreviewProps {
  profileName: string | null;
  profilePicture: string | null;
  coverPicture: string | null;
  linkedin: string | null;
  medium: string | null;
  spotify: string | null;
  website: string | null;
  tags?: string[];
  shortIntroduction?: string;

}

const ProfileCardPreview: React.FC<ProfileCardPreviewProps> = ({
  profileName,
  profilePicture,
  coverPicture,
  linkedin,
  medium,
  spotify,
  website,
  tags = [],
  shortIntroduction,
}) => {

  console.log(profilePicture)
  console.log(coverPicture)
  return (
    <div className={
      `bg-neutral-50 w-full h-[45vh] ml-0 sm:ml-12 rounded-lg flex items-center justify-center
      mb-6 sm:mt-0 sm:h-[95vh]
      `
    }>
      {/* Main Card */}
      <div className="bg-white w-[80%] rounded-md flex flex-col relative p-4 shadow-md m-8">
        <div className="relative">
          {/* Cover Image */}
          <div
            className="w-full h-40 rounded-t-lg bg-gray-200"
            style={{
              backgroundImage: coverPicture ? `url(${coverPicture})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {coverPicture && (
              <div className="absolute inset-0 bg-black opacity-30 rounded-t-lg"></div>
            )}
          </div>

          {/* Profile Picture */}
          <div className="absolute left-6 bottom-0 transform translate-y-1/2">
            <div className="w-32 h-32 rounded-lg shadow-md bg-gray-300">
              {profilePicture && (
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundImage: `url(${profilePicture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 ml-12 flex justify-between items-center">
          <div className="ml-28 mt-2">
            <p className="text-lg font-bold">{profileName}</p>
            <div className="flex items-center space-x-2 mt-1">
              {linkedin && <img src="/icons/linked.svg" alt="LinkedIn" />}
              {medium && <img src="/icons/medium.svg" alt="Medium" />}
              {spotify && <img src="/icons/spotify.svg" alt="Spotify" />}
              {website && <img src="/icons/website.svg" alt="Website" />}
            </div>
          </div>

          <Link href="/dashboard/inbox">
            <Button
              size="small"
              variant="primary"
              className="text-sm flex px-3 py-1 items-center max-w-[150px]"
            >
              <MessageSquare size={16} className="mr-2" />
              Have a Chat
            </Button>
          </Link>
        </div>

        <div>
          <p className="text-[11px] text-neutral-600">{shortIntroduction}</p>
          {/* Tags Section */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="border border-primary-700 text-primary-700 px-2 rounded-[2px] text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardPreview;
