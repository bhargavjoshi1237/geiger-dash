// Motif id (from motif_map.js) -> the animated illustration a feature card renders.
import { BoardMotif } from "@/components/features-hub/motifs/board_motif";
import { BuilderMotif } from "@/components/features-hub/motifs/builder_motif";
import { CardsMotif } from "@/components/features-hub/motifs/cards_motif";
import { ChartMotif } from "@/components/features-hub/motifs/chart_motif";
import { CipherMotif } from "@/components/features-hub/motifs/cipher_motif";
import { LiveMotif } from "@/components/features-hub/motifs/live_motif";
import { MarqueeMotif } from "@/components/features-hub/motifs/marquee_motif";
import { MessagesMotif } from "@/components/features-hub/motifs/messages_motif";
import { NodesMotif } from "@/components/features-hub/motifs/nodes_motif";
import { PeopleMotif } from "@/components/features-hub/motifs/people_motif";
import { PulseMotif } from "@/components/features-hub/motifs/pulse_motif";
import { ScanMotif } from "@/components/features-hub/motifs/scan_motif";
import { SeatsMotif } from "@/components/features-hub/motifs/seats_motif";
import { TimelineMotif } from "@/components/features-hub/motifs/timeline_motif";

export const MOTIF_COMPONENTS = {
  board: BoardMotif,
  builder: BuilderMotif,
  cards: CardsMotif,
  chart: ChartMotif,
  cipher: CipherMotif,
  live: LiveMotif,
  marquee: MarqueeMotif,
  messages: MessagesMotif,
  nodes: NodesMotif,
  people: PeopleMotif,
  pulse: PulseMotif,
  scan: ScanMotif,
  seats: SeatsMotif,
  timeline: TimelineMotif,
};
