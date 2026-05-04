export default function BlogWidget({ title, description, linkText, linkHref, textColor = "text-[#e86c47]", children }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-sm border border-[#212121] bg-[#121212] p-5">
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-[#a1a1aa]">
        {description}
      </p>
      {linkText && (
        <a href={linkHref} className={`${textColor} mb-4 w-fit text-sm font-medium hover:underline`}>
          {linkText}
        </a>
      )}
      {children}
    </div>
  );
}
