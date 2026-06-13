import {
  Crop,
  FileImage,
  Gauge,
  ImageDown,
  LockKeyhole,
  RefreshCcw,
  Scaling,
  Sparkles,
} from "lucide-react";

export const tools = [
  {
    slug: "image-crop",
    name: "Crop Image",
    shortDescription: "Crop PNG, JPG, and WebP images to the exact area you need.",
    icon: Crop,
  },
  {
    slug: "image-resize",
    name: "Resize & Compress Image",
    shortDescription: "Change image dimensions and reduce file size in one pass.",
    icon: Scaling,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription: "Convert images between PNG, JPG, and WebP formats.",
    icon: RefreshCcw,
  },
];

export const toolPages = {
  crop: {
    slug: "image-crop",
    eyebrow: "Free image cropper",
    title: "Crop An Image Without Uploading It.",
    description:
      "Crop PNG, JPG, and WebP images online. Choose the exact area, preview the result, and download a clean image in seconds.",
    highlights: ["No upload", "No account", "25 MB limit"],
    steps: [
      "Choose a PNG, JPG, or WebP image from your device.",
      "Adjust the crop area using the position and size controls.",
      "Preview the crop and download it as a PNG, JPG, or WebP file.",
    ],
    faqs: [
      {
        question: "Is this image cropper free?",
        answer:
          "Yes. You can crop and download images without creating an account or paying for the tool.",
      },
      {
        question: "Does Geiger upload my image?",
        answer:
          "No. Cropping runs locally in your browser, so the selected image does not need to leave your device.",
      },
      {
        question: "Which image formats can I crop?",
        answer:
          "The cropper supports PNG, JPG, JPEG, and WebP input files and can export PNG, JPG, or WebP.",
      },
      {
        question: "Will cropping reduce image quality?",
        answer:
          "PNG exports are lossless. JPG and WebP exports use an adjustable quality setting so you can balance detail and file size.",
      },
    ],
  },
  resize: {
    slug: "image-resize",
    eyebrow: "Free image resizer",
    title: "Resize and compress images in one pass.",
    description:
      "Set exact pixel dimensions, preserve the aspect ratio, control output quality, and download a smaller PNG, JPG, or WebP image.",
    highlights: ["Exact dimensions", "Quality control", "Private by design"],
    steps: [
      "Select the image you want to resize or compress.",
      "Enter a width or height and choose the output quality and format.",
      "Create the optimized image, compare its size, and download it.",
    ],
    faqs: [
      {
        question: "Can I resize an image to exact pixels?",
        answer:
          "Yes. Enter the required width and height in pixels. Keep aspect ratio enabled to avoid stretching the image.",
      },
      {
        question: "How do I make an image file smaller?",
        answer:
          "Reduce its dimensions, lower the quality slightly, or export it as WebP. The result panel shows the new file size before download.",
      },
      {
        question: "What is the best format for a small image?",
        answer:
          "WebP usually provides a strong balance of visual quality and file size. JPG works well for photos, while PNG is useful for transparency and graphics.",
      },
      {
        question: "Are resized images stored by Geiger?",
        answer:
          "No. The resize and compression work happens in your browser and the generated file remains on your device.",
      },
    ],
  },
  convert: {
    slug: "image-converter",
    eyebrow: "Free image converter",
    title: "Convert PNG, JPG, and WebP images.",
    description:
      "Change an image format directly in your browser. Convert PNG to JPG, JPG to PNG, or either format to WebP without an upload queue.",
    highlights: ["PNG to JPG", "JPG to PNG", "WebP conversion"],
    steps: [
      "Choose a PNG, JPG, JPEG, or WebP image.",
      "Select the output format and adjust quality when available.",
      "Convert the image and download the new file immediately.",
    ],
    faqs: [
      {
        question: "How do I convert PNG to JPG?",
        answer:
          "Choose your PNG file, select JPG as the output format, set the quality, and press Convert image. Transparent areas are placed on a white background.",
      },
      {
        question: "Can I convert JPG to PNG?",
        answer:
          "Yes. Select a JPG image and choose PNG. Converting to PNG does not restore detail already lost through JPG compression.",
      },
      {
        question: "Why should I convert an image to WebP?",
        answer:
          "WebP often creates smaller files than PNG or JPG at a similar visual quality, which can help web pages load faster.",
      },
      {
        question: "Is the conversion private?",
        answer:
          "Yes. The conversion uses browser canvas technology and does not require sending your source image to a server.",
      },
    ],
  },
};

export const benefits = [
  {
    icon: LockKeyhole,
    title: "Files stay on your device",
    description:
      "Image processing happens locally in the browser. There is no upload queue and no copy stored by Geiger.",
  },
  {
    icon: Gauge,
    title: "Fast by default",
    description:
      "The tools start as soon as your browser reads the image, without waiting for a remote processing server.",
  },
  {
    icon: ImageDown,
    title: "Useful output controls",
    description:
      "Choose format, dimensions, crop area, and quality instead of accepting a one-size-fits-all export.",
  },
];

export const toolsIndexFeatures = [
  {
    icon: FileImage,
    title: "Real file utilities",
    description: "Every page completes a specific image task from input to download.",
  },
  {
    icon: LockKeyhole,
    title: "Local processing",
    description: "Your source files remain in your browser for a faster, more private workflow.",
  },
  {
    icon: Sparkles,
    title: "Clean results",
    description: "High-quality canvas rendering with practical output controls and no watermark.",
  },
];

