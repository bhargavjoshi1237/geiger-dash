export default function ChangelogWidget({ date, title }) {
  return (
    <div className="flex h-28 w-full min-w-0 items-center justify-center rounded-sm border border-border dark:border-[#212121] bg-surface-subtle dark:bg-[#121212]">
     <div className="w-[88%]">
         <div className="w-full">
        <p className="text-sm text-muted-foreground dark:text-gray-400">{date}</p>
      </div>
      <div className="w-full">
         <h3 className="mt-1 line-clamp-2 text-base font-medium text-foreground sm:text-lg">
        {title}
      </h3>
      </div>
     </div>
    </div>
  );
}
