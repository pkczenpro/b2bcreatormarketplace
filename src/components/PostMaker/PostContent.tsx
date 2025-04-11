/* eslint-disable @next/next/no-img-element */
"use client";


import { Forward, ThumbsUp, MessageCircleMore, Send } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const PostContent = ({ postContent, imagePreview, isReadMore, setIsReadMore }) => (
    <div className="p-6 flex flex-col justify-between">
        {/* Post Content */}
        <div className="max-w-full max-h-[350px] overflow-y-auto">
            <p className={`text-neutral-800 break-words whitespace-pre-wrap mt-4 ${isReadMore ? "" : "max-h-[250px] overflow-y-auto"}`}>
                {isReadMore ? postContent : `${postContent.slice(0, 200)}...`}
                {postContent.length > 200 && (
                    <button onClick={() => setIsReadMore(!isReadMore)} className="text-blue-500 cursor-pointer mt-2">
                        {isReadMore ? "Read less" : "Read more"}
                    </button>
                )}
            </p>
        </div>


        {/* Image Slider */}
        {imagePreview && imagePreview.length > 0 && (
            <Swiper
                spaceBetween={10}
                pagination={{ clickable: true }}
                modules={[
                    Pagination,
                    Autoplay
                ]}
                className="mt-4 rounded-md max-w-[80%]"
                autoplay={{ delay: 1000 }}
            >
                {imagePreview.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            loading="lazy"
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="rounded-md w-full max-h-[300px] object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        )}

        {/* Reactions & Actions */}
        <div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    {["Like", "Celebrate", "Support", "Love", "Insightful", "Curious"].map((reaction) => (
                        <img key={reaction} loading="lazy" src={`/icons/${reaction}.png`} alt={reaction} className="w-5 h-5" />
                    ))}
                    <p className="text-xs text-neutral-500">88</p>
                </div>
                <p className="text-xs text-neutral-500">4 comments</p>
            </div>

            <div className="border-t border-neutral-200 mt-4"></div>

            {/* Post Actions */}
            <div className="flex items-center mt-4 space-x-6">
                {[
                    { icon: <ThumbsUp size={20} />, text: "Like" },
                    { icon: <MessageCircleMore size={20} />, text: "Comment" },
                    { icon: <Forward size={20} />, text: "Share" },
                    { icon: <Send size={20} />, text: "Send" },
                ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center space-x-2">
                        {icon}
                        <p className="text-neutral-600">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default PostContent;