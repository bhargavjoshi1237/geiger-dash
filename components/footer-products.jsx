"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const linkCls = "hover:text-foreground transition-colors text-muted-foreground text-sm";

export default function FooterProducts() {
  return (
    <ul className="space-y-3">
      <li><Link href="/notes" className={linkCls}>Geiger Notes</Link></li>
      <li><Link href="/flow" className={linkCls}>Geiger Flow</Link></li>
      <li><Link href="/assets" className={linkCls}>Geiger Assets</Link></li>
      <li><Link href="/grey" className={linkCls}>Geiger Grey</Link></li>

      <li>
        <Accordion type="single" collapsible>
          <AccordionItem value="more" className="border-none">
            <AccordionTrigger className="py-0 text-sm font-normal text-muted-foreground hover:text-foreground hover:no-underline [&>svg]:size-3.5">
              & 11 More
            </AccordionTrigger>
            <AccordionContent className="pb-0 pt-3">
              <ul className="space-y-3">
                <li><Link href="/office" className={linkCls}>Geiger Office</Link></li>
                <li><Link href="/forms" className={linkCls}>Geiger Forms</Link></li>
                <li><Link href="/events" className={linkCls}>Geiger Events</Link></li>
                <li><Link href="/content" className={linkCls}>Geiger Content</Link></li>
                <li><Link href="/campaign" className={linkCls}>Geiger Campaign</Link></li>
                <li><Link href="/pods" className={linkCls}>Geiger Pods</Link></li>
                <li><Link href="/comms" className={linkCls}>Geiger Comms</Link></li>
                <li><Link href="/chat" className={linkCls}>Geiger Chat</Link></li>
                <li><Link href="/canvas" className={linkCls}>Geiger Canvas</Link></li>
                <li><Link href="/docs" className={linkCls}>Geiger Docs</Link></li>
               </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </li>
    </ul>
  );
}
