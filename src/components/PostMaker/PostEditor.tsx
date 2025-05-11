import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { Clock, ImagePlus, Linkedin, Send, Sparkles } from "lucide-react";
import api from "@/utils/axiosInstance";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import AiLoaderOverlay from "@/components/LoadingOverlay/AiLoaderOverlay";
import axios from "axios";

const { Title } = Typography;

const schema = z.object({
  post: z.string().min(1, "Post cannot be empty"),
});

type FormData = z.infer<typeof schema>;

const hookOptions = [
  "Trending and Timely Hook",
  "Value Driven Hook",
  "Curiosity Driven Hook",
  "Lead Magnet Style Hook",
  "Awareness Type Hook",
];

const PostEditor = ({
  postContent,
  setPostContent,
  handleTextFormatting,
  handleImageUpload,
  relatedCampaigns,
  selectedCampaign,
  setSelectedCampaign,
  publishToLinkedIn,
  isSelectSharingModalOpen,
  setIsSelectSharingModalOpen,
  publishLoading,

  setRelatedProducts,
  relatedProduct,
  relatedProductsOptions,

  brandName,
  setBrandName,

  modelName,
  setModelName,
}) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [hookType, setHookType] = useState("");

  const fileInputRef = useRef(null);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { post: "" },
  });

  const [aiLoader, setAiLoader] = useState(false);

  const generatePostWithAI = async () => {
    if (!aiPrompt) return;
    setAiLoader(true);
    try {
      const response = await api.post("/campaigns/generate-post", {
        prompt: aiPrompt,
        selectedCampaign,
        selectedProduct,
        brandName,
        hookType,
        modelName,
      });
      setPostContent(response.data.post);
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setAiLoader(false);
    }
  };

  const onFormat = (variants: string[]) => {
    const textarea = document.getElementById(
      "postTextarea"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart !== selectionEnd) {
      const selectedText = postContent.slice(selectionStart, selectionEnd);
      const formattedText = variants.reduce((text, variant) => {
        return toUnicodeVariant(text, variant, [
          variant === "strikethrough" ? "strike" : "",
          variant === "underline" ? "underline" : "",
        ]);
      }, selectedText);

      const updatedText =
        postContent.slice(0, selectionStart) +
        formattedText +
        postContent.slice(selectionEnd);
      setPostContent(updatedText);
    }
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setUploadedImages((prev) => [...prev, ...files]);
    handleImageUpload(files);
  };

  const characterCount = postContent.length;
  const characterLimit = 3000;

  const [schedulePostModalOpen, setSchedulePostModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null); // moment object
  const [scheduledDateString, setScheduledDateString] = useState("");
  const [label, setLabel] = useState("");
  const schedulePost = async () => {
    if (!scheduledDate) {
      toast.error("Please select a scheduled date.");
      return;
    }

    // Convert the selected scheduledDate (local time) to UTC using Moment.js
    const scheduledDateUtc = moment(scheduledDateString)
      .local()
      .utc()
      .toISOString(); // Convert to UTC

    const formData = new FormData();
    formData.append("textContent", postContent);
    formData.append("type", "AI Text Post");
    formData.append("scheduledDate", scheduledDateUtc);
    formData.append("label", label);
    for (const i of uploadedImages) {
      formData.append("images", i);
    }

    try {
      // Send the UTC date to the backend
      const response = await api.post("/campaigns/schedule-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        "Post scheduled successfully, your post will be shared at " +
          moment(scheduledDateUtc).format("DD/MM/YYYY HH:mm")
      );
      setSchedulePostModalOpen(false);
    } catch (error) {
      console.error("Schedule Post Error:", error);
      toast.error("Failed to schedule post");
    }
  };

  const schedulePostModal = () => {
    return (
      <Modal
        open={schedulePostModalOpen}
        onCancel={() => setSchedulePostModalOpen(false)}
        onOk={schedulePost}
        okText="🚀 Schedule Now"
        cancelText="❌ Cancel"
        centered
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              ⏰ Schedule Your Post!
            </Title>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <h3 className="font-semibold mb-2 text-lg">
              🏷️ Add a Label <span className="text-gray-500">(optional)</span>
            </h3>
            <Input
              placeholder="e.g. Monday Motivation 💪"
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <p className="font-medium text-base mb-2">
              📅 Pick a date & time to go live!
            </p>
            <DatePicker
              showTime
              style={{ width: "100%", marginTop: 8 }}
              onChange={(mainDate, date) => {
                console.log(mainDate, date);
                setScheduledDate(mainDate);
                setScheduledDateString(date);
              }}
              value={scheduledDate}
              format="YYYY-MM-DD HH:mm:ss"
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </Space>
      </Modal>
    );
  };

  const [models, setModels] = useState([]);
  const getAiModels = async () => {
    const modelsArray = [
      {
        id: "gpt-3.5-turbo",
        display_name: "GPT-3.5 Turbo",
      },
      {
        id: "gpt-4",
        display_name: "GPT-4",
      },
      {
        id: "meta-llama/Llama-3-70b-chat-hf",
        display_name: "Llama 3",
      },
      {
        id: "Qwen/Qwen2.5-7B-Instruct-Turbo",
        display_name: "Qwen 2.5",
      },
    ];

    setModels(modelsArray);
  };

  useEffect(() => {
    getAiModels();
  }, []);

  return (
    <div className="flex flex-col w-full mx-auto bg-white py-6 gap-5">
      {schedulePostModal()}
      {/* Campaign & Product Section */}
      {isSelectSharingModalOpen === "1" && (
        <div className="flex gap-2 justify-between">
          <div className="w-full max-w-[30%]">
            <p className="font-semibold text-neutral-700 mb-2 text-sm">
              Select Campaign
            </p>
            <Select
              className="w-full"
              placeholder="Choose campaign"
              value={selectedCampaign}
              onChange={setSelectedCampaign}
              options={relatedCampaigns.map((c) => ({
                label: c.title,
                value: c._id,
              }))}
            />
          </div>
          <div className="w-full max-w-[30%]">
            <p className="font-semibold text-neutral-700 mb-2 text-sm">
              Select Product
            </p>
            <Select
              className="w-full"
              placeholder="Choose product"
              value={relatedProduct}
              onChange={setRelatedProducts}
              options={relatedProductsOptions?.map((p) => ({
                label: p.productName,
                value: p._id,
              }))}
            />
          </div>
          <div className="w-full max-w-[30%]">
            <p className="font-semibold text-neutral-700 mb-2 text-sm">
              Brand Name
            </p>
            <Input
              className="w-full"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Hook Type */}
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2 text-sm">Hook Type</p>
        <Select
          className="w-full"
          value={hookType}
          onChange={setHookType}
          options={hookOptions.map((hook) => ({ label: hook, value: hook }))}
        />
      </div>

      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2 text-sm">
          AI Companion
        </p>
        <Select
          className="w-full"
          defaultValue="0"
          value={modelName}
          onChange={(value) => setModelName(value)}
          showSearch
          optionFilterProp="children"
        >
          {models.map((model) => (
            <Select.Option key={model.id} value={model.id}>
              {model?.display_name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {aiLoader && <AiLoaderOverlay loading={aiLoader} />}
      {/* AI Prompt */}
      <div>
        <p className="font-semibold text-neutral-700 mb-2 flex items-center gap-2 text-sm">
          Create with AI in Seconds ⚡
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Describe your idea..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <Button
            type="primary"
            loading={loading}
            icon={<Send size={16} />}
            onClick={generatePostWithAI}
          >
            Generate
          </Button>
        </div>
      </div>

      {/* Post Editor */}
      <div>
        <p className="font-semibold text-neutral-700 mb-2 text-sm">
          Write your Post
        </p>
        <Input.TextArea
          id="postTextarea"
          rows={12}
          placeholder="Start writing here..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {[
            "bold",
            "italic",
            "monospace",
            "script",
            "strikethrough",
            "underline",
          ].map((variant) => (
            <Tooltip
              key={variant}
              title={variant.charAt(0).toUpperCase() + variant.slice(1)}
            >
              <button
                onClick={() => onFormat([variant])}
                className="px-3 py-1 border rounded text-sm hover:bg-neutral-100 focus:outline-none"
              >
                {variant}
              </button>
            </Tooltip>
          ))}
        </div>

        <p className="text-sm text-neutral-500 mt-4">
          {characterCount}/{characterLimit} characters
        </p>
      </div>

      {/* Image Upload + Submit Section */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            icon={<ImagePlus size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Image
          </Button>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={onImageUpload}
          />
          <div className="flex gap-2 mt-2">
            {uploadedImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<Linkedin size={16} />}
            onClick={publishToLinkedIn}
            loading={publishLoading || loading}
          >
            Publish to LinkedIn{" "}
            {publishLoading || (loading && <LoadingOutlined size={16} />)}
          </Button>

          {isSelectSharingModalOpen === "0" && (
            <Button
              icon={<Clock size={16} />}
              onClick={() => {
                setSchedulePostModalOpen(true);
              }}
            >
              Schedule Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
