import ChangelogWidget from "./changelog_widget";

export default function ChangeLogComponent() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[75%] px-5">
      <p className="text-2xl">Change Log</p>
      </div>
    <div className="flex gap-4 items-center justify-center py-4">
          <ChangelogWidget date="May 1, 2026" title="Team Marketplace Updates" />
          <ChangelogWidget date="April 28, 2026" title="New Feature Release" />
          <ChangelogWidget date="April 25, 2026" title="Bug Fixes and Improvements" />
          <ChangelogWidget date="April 22, 2026" title="Performance Enhancements" />
    </div>
  <div className="w-[75%] px-5">
      <a href="#change-log" className="mt-12 text-white hover:underline">
      See what's new in Geiger Studio →
    </a>
  </div>
    </div>
  );
}