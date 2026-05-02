export default function BlogWidget({ title, description, linkText, linkHref, textColor = "text-[#e86c47]", children }) {
  return (
    <div className="bg-[#121212] border border-[#212121] rounded-sm p-5">
      <h3 className="text-base font-semibold mb-2 text-white">{title}</h3>
      <p className="text-[#a1a1aa] mb-4 text-sm flex-1 leading-relaxed">
        {description}
      </p>
      {linkText && (
        <a href={linkHref} className={`${textColor} hover:underline mb-4 text-sm w-fit font-medium`}>
          {linkText}
        </a>
      )}
      {children}
    </div>
  );
}