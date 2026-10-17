import PlaygroundFrame from "@/components/playground-frame";

export default function Section() {
  return (
    <div
      className="relative mx-auto mt-6 h-[520px] w-full max-w-[85%] rounded-sm bg-cover bg-center bg-no-repeat px-3 py-3 sm:mt-10 sm:h-[700px] sm:px-6 sm:py-8 lg:h-[900px]"
      style={{
        backgroundImage:
          "url('https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-cc24ca462279ca23250c.jpg')",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-border dark:border-[#313131] shadow-2xl">
        <PlaygroundFrame src="/flow/playground" title="Geiger Flow playground" />
      </div>
    </div>
  );
}
