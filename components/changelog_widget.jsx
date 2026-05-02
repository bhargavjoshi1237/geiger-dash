export default function ChangelogWidget({ date, title }) {
  return (
    <div className="bg-[#121212] border border-[#212121] rounded-sm w-84 h-28 items-center justify-center flex flex-col">
     <div className="w-[88%] -mt-4">
         <div className="w-full">
        <p className="text-sm text-gray-400">{date}</p>
      </div>
      <div className="w-full -mt-1">
         <h3 className="text-white text-lg font-medium mt-1">
        {title}
      </h3>
      </div>
     </div>
    </div>
  );
}