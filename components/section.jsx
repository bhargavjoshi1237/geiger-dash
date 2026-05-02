"use client";

import dynamic from "next/dynamic";

const FlowPlayground = dynamic(
  () => import("@/components/flow-playground/FlowPlayground").then((mod) => mod.FlowPlayground),
  {
    ssr: false,
  }
);

export default function Section() {
    return (<>
    
    <div className="h-[900px] ml-auto mr-auto mt-10 w-[80%] relative rounded-sm bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fmisc%2Fasset-cc24ca462279ca23250c.jpg&w=1920&q=70')"}}>
        <div className="absolute inset-0 flex flex-col mx-10 mt-14 mb-18">
          <div className="flex-1 relative h-full w-full rounded-lg overflow-hidden">
              <FlowPlayground />
          </div>
        </div>
    </div>

    </>)
}