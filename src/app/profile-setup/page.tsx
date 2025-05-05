"use client";

import { use, useEffect, useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import ProfileCardPreview from "@/components/ProfileCardPreview/ProfileCardPreview";
import React from "react";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { toast } from "sonner";

type ProfileSetupProps = object;

type UserData = {
  name: string;
  location: string;
  profileImage: string | null;
  coverImage: string | null;
  socialMediaLinks: { platform: string; link: string }[];
  bio: string;
  tags: string[];
  userType: string;
  category: string;
  subCategory: string;
};

export default function ProfileSetup({ }: ProfileSetupProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/user");
      setUserData(response.data);
      setUserType(response.data.userType);
    } catch (error) {
      console.error("Profile setup error:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUserData();
  }, []);


  const [profileName, setProfileName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverPicture, setCoverPicture] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState<string>("");
  const [medium, setMedium] = useState<string>("");
  const [spotify, setSpotify] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [otherLinks, setOtherLinks] = useState<string>("");
  const [openOtherLinks, setOpenOtherLinks] = useState<boolean>(false);
  const [shortIntroduction, setShortIntroduction] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagText, setTagText] = useState("");

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");


  useEffect(() => {
    if (userData) {
      setProfileName(userData.name);
      setLocation(userData.location);
      setProfilePicture(userData.profileImage);
      setCoverPicture(userData.coverImage);
      setLinkedin(
        userData.socialMediaLinks.find(
          (item) => item.platform === "linkedin"
        )?.link || ""
      );
      setMedium(
        userData.socialMediaLinks.find((item) => item.platform === "medium")
          ?.link || ""
      );
      setSpotify(
        userData.socialMediaLinks.find((item) => item.platform === "spotify")
          ?.link || ""
      );
      setWebsite(
        userData.socialMediaLinks.find((item) => item.platform === "website")
          ?.link || ""
      );
      setOtherLinks(
        userData.socialMediaLinks.find((item) => item.platform === "otherLinks")
          ?.link || ""
      );
      setShortIntroduction(userData.bio === "undefined" ? "" : userData.bio || "");
      setTags(userData.tags || []);

      setCategory(userData.category || "");
      setSubCategory(userData.subCategory || "");
    }
  }, [userData]);


  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      setTags([...tags, e.currentTarget.value.trim()]);
      setTagText("");
    }
  };
  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setProfilePicture(URL.createObjectURL(event.target.files[0]));
      setProfileFile(event.target.files[0]);
    }
  };

  const handleCoverPictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setCoverPicture(URL.createObjectURL(event.target.files[0]));
      setCoverFile(event.target.files[0]);
    }
  };

  const handleMainCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    setSubCategory(""); // Reset subcategory when main category changes
  }
  const handleSubCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSubCategory(event.target.value);
  }
  

  const [activeId, setActiveId] = useState(1);

  const ProfileInformation = () => {
    return (
      <div>
        {userType === "creator" ? (
          <>
            <h1 className="text-h5 font-bold text-left mb-1">Profile Name</h1>
            <p className="text-neutral-600 text-left mb-6">
              Change your profile name if it differs from your previously
              entered full name.
            </p>
            <div className="w-[70%]">
              <Input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Andrew Bishop"
                required
                name="profileName"
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-h5 font-bold text-left mb-1">Brand Name</h1>
            <p className="text-neutral-600 text-left mb-6">
              Provide the creators with your brand name.
            </p>
            <div className="w-[70%]">
              <Input
                size="large"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder=""
                required
                name="brandName"
              />
            </div>
          </>
        )}
        <h1 className="text-h5 font-bold text-left mb-1 mt-10">
          Profile Picture
        </h1>
        <p className="text-neutral-600 text-left mb-6">
          Select a profile picture for your account. Your profile picture is key
          to establishing trust and authenticity with the brand.
        </p>
        <div className="w-[70%]">
          <Input
            type="file"
            required
            name="profilePicture"
            onChange={handleProfilePictureUpload}
            value={profilePicture || ""}
          />
        </div>
        <h1 className="text-h5 font-bold text-left mb-1 mt-10">
          Cover Picture
        </h1>
        <p className="text-neutral-600 text-left mb-6">
          Your cover photo speaks volumes about you—make sure it speaks the
          right message.
        </p>
        <div className="w-[70%]">
          <Input
            type="file"
            value={coverPicture || ""}
            onChange={handleCoverPictureUpload}
            required
            name="coverPicture"
          />
        </div>
      </div>
    );
  };

  const SocialLinks = () => {
    return (
      <>
        <h1 className="text-h5 font-bold text-left mb-1">Social Links</h1>
        <p className="text-neutral-600 text-left mb-6">
          Give your potential clients a chance to see your work by providing
          them with a window to your social media.
        </p>
        <form className="space-y-4 w-[70%]">
          <Input
            label="LinkedIn"
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            required
            name="linkedin"
          />
          <Input
            label="Medium"
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="medium.com/@johndoe"
            required
            name="medium"
          />
          <Input
            label="Spotify"
            type="text"
            value={spotify}
            onChange={(e) => setSpotify(e.target.value)}
            placeholder="open.spotify.com/user/johndoe"
            required
            name="spotify"
          />
          <Input
            label="Website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="johndoe.com"
            required
            name="website"
          />
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setOpenOtherLinks(!openOtherLinks)}
          >
            <Plus size={20} className="text-primary-700" />
            <p className="text-primary-700 font-medium">Add more</p>
          </div>
          {openOtherLinks && (
            <Input
              label="Other Links"
              type="text"
              value={otherLinks}
              onChange={(e) => setOtherLinks(e.target.value)}
              placeholder=""
              required
              name="otherLinks"
            />
          )}
        </form>
      </>
    );
  };

  const ShortIntroduction = () => {
    return (
      <>


        {userType === "brand" && (
          <>
            <h1 className="text-h5 font-bold text-left mb-1">
              Company Location
            </h1>
            <p className="text-neutral-600 text-left mb-6">
              Let creators know where you are located
            </p>
            <div className="w-[70%] mb-4">
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                required
                name="location"
              />
            </div>

            <h1 className="text-h5 font-bold text-left mb-1">
              Company Category
            </h1>
            <p className="text-neutral-600 text-left mb-6">
              Select the category that best describes your company.
            </p>
            <div className="w-[70%] mb-4">
              <select
                value={category}
                onChange={handleMainCategoryChange}
                className="w-full p-2 border text-sm border-neutral-200 rounded-lg"
              >
                <option value="">Select Category</option>
                <option value="tech">Tech</option>
                <option value="fashion">Fashion</option>
                <option value="food">Food</option>
                {/* Add more categories as needed */}
              </select>

              {category && (
                <select
                  value={subCategory}
                  onChange={handleSubCategoryChange}
                  className="w-full p-2 border text-sm border-neutral-200 rounded-lg mt-2"
                >
                  <option value="">Select Subcategory</option>
                  {category === "tech" && (
                    <>
                      <option value="software">Software</option>
                      <option value="hardware">Hardware</option>
                    </>
                  )}
                  {category === "fashion" && (
                    <>
                      <option value="clothing">Clothing</option>
                      <option value="accessories">Accessories</option>
                    </>
                  )}
                  {category === "food" && (
                    <>
                      <option value="snacks">Snacks</option>
                      <option value="beverages">Beverages</option>
                    </>
                  )}
                </select>
              )}
            </div>
          </>
        )}

        <h1 className="text-h5 font-bold text-left mb-1">Short Introduction</h1>
        <p className="text-neutral-600 text-left mb-6">
          Share a little bit about yourself and what you can provide for the
          brands.
        </p>
        <textarea
          className="w-full h-24 p-2 border text-sm border-neutral-200 rounded-lg min-h-[150px] mb-4"
          placeholder="Tell a bit about yourself"
          value={shortIntroduction}
          onChange={(e) => setShortIntroduction(e.target.value)}
        />

        <div>
          <h1 className="text-sm font-bold text-left mb-1">
            Add Relevant Tags
          </h1>
          <Input
            type="text"
            value={tagText}
            onChange={(e) => setTagText(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Enter tag and press enter"
            required
            name="tags"
            size="medium"
          />
          <div className="mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm mr-2 mb-2"
              >
                {tag}{" "}
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => setTags(tags.filter((item) => item !== tag))}
                >
                  x
                </span>
              </span>
            ))}
          </div>
        </div>
      </>
    );
  };

  const sections = [
    {
      id: 1,
      content: ProfileInformation(),
    },
    {
      id: 2,
      content: SocialLinks(),
    },
    {
      id: 3,
      skip: true,
      content: ShortIntroduction(),
    },
  ];

  // const [loading, setLoading] = useState(false);
  const finishSetup = async () => {
    setLoading(true);
    console.log("profileFile", profilePicture);
    console.log("coverFile", coverPicture);
    if ((!profileFile && !profilePicture) || (!coverFile && !coverPicture)) {
      toast.error("Please upload profile and cover picture");
      setLoading(false);
      return;
    }

    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      setLoading(false);
      return
    }

    if (!shortIntroduction) {
      toast.error("Please add a short introduction");
      setLoading(false);
      return
    }

    try {
      const formData = new FormData();

      // Append text fields
      formData.append("profileName", profileName);
      formData.append("location", location);
      formData.append("bio", shortIntroduction);
      formData.append("tags", JSON.stringify(tags)); // For array data, you might need to stringify it
      formData.append("isCompletedOnboarding", "true");
      formData.append("category", category);
      formData.append("subCategory", subCategory);

      // Append social media links as JSON (stringified array)
      formData.append(
        "socialMediaLinks",
        JSON.stringify([
          { platform: "linkedin", link: linkedin || "" },
          { platform: "medium", link: medium || "" },
          { platform: "spotify", link: spotify || "" },
          { platform: "website", link: website || "" },
          { platform: "otherLinks", link: otherLinks || "" },
        ])
      );

      // Append files
      if (profileFile) {
        formData.append("profileImage",
          profileFile
        );
      }
      if (coverFile) {
        formData.append("coverImage",
          coverFile
        );
      }

      // Make the POST request with FormData
      const res = await api.post("/users/complete-onboarding", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Profile setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse items-center justify-center bg-white p-4 md:flex-row md:p-6 relative">
      <LoadingOverlay
        loading={loading}
      />
      <div className="w-full max-w-lg md:w-[40vw] ml-0 md:ml-24">
        <h1 className="text-h3 font-bold text-left mb-1">Setup Your Profile</h1>
        <p className="text-neutral-600 text-left mb-6 md:mb-10">
          Welcome to Linkish! Let’s get a head start on your profile.
        </p>

        {sections
          .filter((item) => item.id === activeId)
          .map((section) => (
            <div key={section.id} className="mb-6 md:mb-10">
              {section.content}
            </div>
          ))}

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          {sections[activeId - 1]?.skip && (
            <Button
              variant="secondary"
              className="underline text-primary-700 w-full md:w-auto"
              onClick={() => { }}
              size="small"
            >
              Skip this step {loading && <Spin />}
            </Button>
          )}

          {activeId > 1 && (
            <Button
              variant="outline"
              className="px-4 w-full md:w-auto"
              socialMediaIcon={<ArrowLeft />}
              size="small"
              onClick={() => {
                if (activeId > 1) setActiveId(activeId - 1);
              }}
            >
              Go Back {loading && <Spin />}
            </Button>
          )}

          {activeId < sections.length ? (
            <Button
              variant="primary"
              className="px-4 ml-0 md:ml-4 w-full md:w-auto"
              icon={<ArrowRight />}
              onClick={() => setActiveId(activeId + 1)}
              size="small"
            >
              Continue {loading && <Spin />}
            </Button>
          ) : (
            <Button
              size="small"
              className="w-full mt-4 md:mt-0 md:ml-4"
              variant="primary"
              icon={<ArrowRight />}
              loading={loading}
              onClick={() => {
                finishSetup();
              }}
            >
              Finish Setting Up {loading && <Spin />}
            </Button>
          )}
        </div>
      </div>

      <ProfileCardPreview
        profileName={profileName}
        profilePicture={profilePicture}
        coverPicture={coverPicture}
        linkedin={linkedin}
        medium={medium}
        spotify={spotify}
        website={website}
        tags={tags}
        shortIntroduction={shortIntroduction}
      />
    </div>

  );
}
