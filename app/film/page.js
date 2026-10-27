import { notFound } from "next/navigation";
import { FilmPlayer } from "@/components/film/film_player";

// The launch films, composed in code: preview one here in development (?film=<id>), render it with scripts/film/render.mjs.
export const metadata = {
  title: "Launch film",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { film } = await searchParams;
  return <FilmPlayer id={typeof film === "string" ? film : "suite"} />;
}
