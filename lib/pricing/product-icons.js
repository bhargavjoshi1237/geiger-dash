// Product id -> Lucide icon. The catalog in lib/pricing/plans.js is deliberately
// icon-free so the server-side checkout can import it; every surface that
// renders a product (pricing calculator, billing, profile) maps through here.
import {
  Box,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileSignature,
  FileStack,
  GalleryVerticalEnd,
  Globe,
  Image as ImageIcon,
  Link2,
  Lock,
  MailPlus,
  Megaphone,
  MessagesSquare,
  Network,
  Workflow,
} from "lucide-react";

export const PRODUCT_ICONS = {
  campaign: Megaphone,
  flow: Workflow,
  events: CalendarDays,
  assets: ImageIcon,
  comms: MessagesSquare,
  forms: CheckCircle2,
  grey: BrainCircuit,
  office: BriefcaseBusiness,
  docs: FileSignature,
  content: GalleryVerticalEnd,
  pods: Network,
  notes: FileStack,
  property: Building2,
  oauth: Lock,
  subdomain: Link2,
  domain: Globe,
  emailTemplate: MailPlus,
};

// Stands in for a product id the catalog doesn't know about.
export const FallbackProductIcon = Box;
