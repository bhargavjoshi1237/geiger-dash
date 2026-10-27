import { notFound } from "next/navigation";
import { findTour, findTourPage, pageMetadata } from "@/components/product-pages/tours";
import { NotesCanvasPage } from "@/components/product-pages/apps/notes/canvas_page";
import { NotesLiveSessionsPage } from "@/components/product-pages/apps/notes/live_sessions_page";
import { NotesMeetingsPage } from "@/components/product-pages/apps/notes/meetings_page";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
export const dynamicParams = false;

const PAGES = {
  "canvas": NotesCanvasPage,
  "live-sessions": NotesLiveSessionsPage,
  "meetings": NotesMeetingsPage,
};

export function generateStaticParams() {
  return findTour("notes").pages.map((page) => ({ topic: page.id }));
}

export async function generateMetadata({ params }) {
  const { topic } = await params;
  return pageMetadata(findTourPage("notes", topic));
}

export default async function Page({ params }) {
  const { topic } = await params;
  const Component = PAGES[topic];
  if (!Component) notFound();
  return <Component />;
}
