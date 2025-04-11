'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";

const schema = z.object({
    post: z.string().min(1, "Post cannot be empty"),
});

type FormData = z.infer<typeof schema>;

interface LinkedInPostFormatterProps {
    className?: string;
}

const LinkedInPostFormatter = ({ className }: LinkedInPostFormatterProps) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { post: "" }
    });

    const [copied, setCopied] = useState(false);

    const onFormat = (variants: ("bold" | "italic" | "monospace" | "script" | "strikethrough" | "underline")[]) => {
        const textarea = document.getElementById("postTextarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const currentText = watch("post");

        if (selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd) {
            const selectedText = currentText.slice(selectionStart, selectionEnd);

            const formattedText = variants.reduce((text, variant) => {
                return toUnicodeVariant(text, variant, [
                    variant === "strikethrough" ? "strike" : "",
                    variant === "underline" ? "underline" : "",
                ]);
            }, selectedText);

            const updatedText = currentText.slice(0, selectionStart) + formattedText + currentText.slice(selectionEnd);
            setValue("post", updatedText);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(watch("post"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const characterCount = watch("post").length;
    const characterLimit = 3000;

    return (
        <div className={`max-w-full ${className}`}>
            {/* <textarea
                id="postTextarea"
                {...register("post")}
                className="w-full min-h-[200px] border border-neutral-300 p-3 rounded"
                placeholder="Write your LinkedIn post here..."
                maxLength={characterLimit}
            /> */}

            {errors.post && <p className="text-red-500 text-sm mt-1">{errors.post.message}</p>}

            <div className="flex items-center gap-2 mt-4 flex-wrap">
                {["bold", "italic", "monospace", "script", "strikethrough", "underline"].map((variant) => (
                    <button
                        key={variant}
                        onClick={() => onFormat([variant as any])}
                        className="px-2 py-1 border rounded text-sm hover:bg-neutral-100"
                    >
                        {variant}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between mt-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button onClick={handleCopy} className="flex items-center gap-1 text-blue-600 hover:underline">
                                {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Post"}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <p className="text-sm text-neutral-500">{characterCount}/{characterLimit} characters</p>
            </div>
        </div>
    );
};

export default LinkedInPostFormatter;
