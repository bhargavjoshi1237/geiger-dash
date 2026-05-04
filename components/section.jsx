"use client";

import dynamic from "next/dynamic";

const FlowPlayground = dynamic(
  () => import("@/components/flow-playground/FlowPlayground").then((mod) => mod.FlowPlayground),
  {
    ssr: false,
  }
);

export default function Section() {
  return (
    <div
      className="relative mx-auto mt-6 h-[520px] w-full max-w-7xl rounded-sm bg-cover bg-center bg-no-repeat px-3 py-3 sm:mt-10 sm:h-[700px] sm:px-6 sm:py-8 lg:h-[900px]"
      style={{
        backgroundImage:
          "url('https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fmisc%2Fasset-cc24ca462279ca23250c.jpg&w=1920&q=70')",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <FlowPlayground />
      </div>
    </div>
  );
}
