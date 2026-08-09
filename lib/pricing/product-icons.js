// Product id -> Lucide icon. The catalog in lib/pricing/plans.js is deliberately
// icon-free so the server-side checkout can import it; every surface that
// renders a product (pricing calculator, billing, profile) maps through here.
import {
  BookOpen,
  Box,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Code2,
  FileStack,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  Link2,
  Lock,
  MailPlus,
  Megaphone,
  MessageSquareText,
  Podcast,
  RadioTower,
  Sparkles,
  Workflow,
} from "lucide-react";

export const PRODUCT_ICONS = {
  campaign: Megaphone,
  flow: Workflow,
  events: CalendarDays,
  assets: ImageIcon,
  comms: RadioTower,
  forms: CheckCircle2,
  grey: Sparkles,
  office: BriefcaseBusiness,
  docs: BookOpen,
  content: Code2,
  pods: Podcast,
  chat: MessageSquareText,
  notes: FileStack,
  canvas: FolderKanban,
  property: Building2,
  oauth: Lock,
  subdomain: Link2,
  domain: Globe,
  emailTemplate: MailPlus,
};

// Stands in for a product id the catalog doesn't know about.
export const FallbackProductIcon = Box;
