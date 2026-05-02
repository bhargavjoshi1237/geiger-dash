import BlogWidget from "./blog_widget";

export default function BlogComponent() {
  return (
   <div className="w-full flex flex-col items-center">
         <div className="w-[75%] px-5">
         <p className="text-2xl">Stay on the frontier</p>
         </div>
       <div className="flex gap-4 items-stretch justify-center py-6 w-[73%]">
             <BlogWidget 
               title="Use the best model for every task"
               description="Choose between every cutting-edge model from OpenAI, Anthropic, Gemini, xAI, and Cursor."
               linkText="Explore models ↗"
               linkHref="#"
             >
               <div className="h-128 bg-[#1a1a1b] rounded-md mt-4 border border-zinc-800/50 flex items-center justify-center">
                 <span className="text-zinc-500 text-sm">Models</span>
               </div>
             </BlogWidget>
             <BlogWidget 
               title="Complete codebase understanding"
               description="Cursor learns how your codebase works, no matter the scale or complexity."
               linkText="Learn about codebase indexing ↗"
               linkHref="#"
             >
               <div className="h-128 bg-[#1a1a1b] rounded-md mt-4 border border-zinc-800/50 flex items-center justify-center">
                 <span className="text-zinc-500 text-sm">Codebase</span>
               </div>
             </BlogWidget>
             <BlogWidget 
               title="Develop enduring software"
               description="Trusted by over half of the Fortune 500 to accelerate development, securely and at scale."
               linkText="Explore enterprise →"
               linkHref="#"
             >
               <div className="h-128 bg-[#1a1a1b] rounded-md mt-4 border border-zinc-800/50 flex items-center justify-center">
                 <span className="text-zinc-500 text-sm">Enterprise</span>
               </div>
             </BlogWidget>
       </div>
     <div className="w-[75%] px-5">
         <a href="#change-log" className="mt-12 text-white hover:underline">
         See what's new in Geiger Studio →
       </a>
     </div>
       </div>
  );
}