"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Link2,
  RefreshCw,
  Settings,
  ShieldCheck,
  Unlink,
} from "lucide-react";

const GitHubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const AWSIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z" />
  </svg>
);

const VercelIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
);

const SupabaseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 128 128" aria-hidden="true">
    <defs>
      <linearGradient id="supabase-green-a" x1="53.974" x2="94.163" y1="54.974" y2="71.829" gradientTransform="translate(29.387 60.096)scale(1.1436)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#249361" />
        <stop offset="1" stopColor="#3ecf8e" />
      </linearGradient>
      <linearGradient id="supabase-green-b" x1="36.156" x2="54.484" y1="30.578" y2="65.081" gradientTransform="translate(29.387 60.096)scale(1.1436)" gradientUnits="userSpaceOnUse">
        <stop offset="0" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path fill="url(#supabase-green-a)" d="M102.24 186.21c-3.267 4.117-9.904 1.862-9.977-3.397l-1.156-76.906h51.715c9.365 0 14.587 10.817 8.763 18.149z" transform="translate(-27.722 -60.338)" />
    <path fill="url(#supabase-green-b)" fillOpacity=".2" d="M102.24 186.21c-3.267 4.117-9.904 1.862-9.977-3.397l-1.156-76.906h51.715c9.365 0 14.587 10.817 8.763 18.149z" transform="translate(-27.722 -60.338)" />
    <path fill="#3ecf8e" d="M53.484 2.128c3.267-4.117 9.905-1.862 9.977 3.396l.508 76.907H12.902c-9.365 0-14.587-10.817-8.764-18.149z" />
  </svg>
);

const AzureIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#e7e7e7" d="M13.05 4.24L6.56 18.05L2 18l5.09-8.76zm.7 1.09L22 19.76H6.74l9.3-1.66l-4.87-5.79z" />
  </svg>
);

const GCPIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 128 128" aria-hidden="true">
    <path fill="#ea4535" d="M80.6 40.3h.4l-.2-.2l14-14v-.3c-11.8-10.4-28.1-14-43.2-9.5S24.9 32.8 20.7 48c.2-.1.5-.2.8-.2c5.2-3.4 11.4-5.4 17.9-5.4c2.2 0 4.3.2 6.4.6c.1-.1.2-.1.3-.1c9-9.9 24.2-11.1 34.6-2.6z" />
    <path fill="#557ebf" d="M108.1 47.8c-2.3-8.5-7.1-16.2-13.8-22.1L80 39.9c6 4.9 9.5 12.3 9.3 20v2.5c16.9 0 16.9 25.2 0 25.2H63.9v20h-.1l.1.2h25.4c14.6.1 27.5-9.3 31.8-23.1s-1-28.8-13-36.9" />
    <path fill="#36a852" d="M39 107.9h26.3V87.7H39c-1.9 0-3.7-.4-5.4-1.1l-15.2 14.6v.2c6 4.3 13.2 6.6 20.7 6.6z" />
    <path fill="#f9bc15" d="M40.2 41.9c-14.9.1-28.1 9.3-32.9 22.8c-4.8 13.6 0 28.5 11.8 37.3l15.6-14.9c-8.6-3.7-10.6-14.5-4-20.8c6.6-6.4 17.8-4.4 21.7 3.8L68 55.2C61.4 46.9 51.1 42 40.2 42.1z" />
  </svg>
);

const integrations = [
  {
    id: "github",
    name: "GitHub",
    summary: "Repository sync, pull requests, issues, and webhook events.",
    icon: GitHubIcon,
    category: "Source control",
    features: ["Repo sync", "Webhooks", "PR status"],
    docsUrl: "https://docs.github.com",
    lastActivity: "Synced 4m ago",
    accent: "neutral",
  },
  {
    id: "vercel",
    name: "Vercel",
    summary: "Preview deployments, production promotion, and deployment checks.",
    icon: VercelIcon,
    category: "Deployments",
    features: ["Previews", "Domains", "Build logs"],
    docsUrl: "https://vercel.com/docs",
    lastActivity: "Deployed 22m ago",
    accent: "neutral",
  },
  {
    id: "supabase",
    name: "Supabase",
    summary: "Database, auth, storage, and realtime project events.",
    icon: SupabaseIcon,
    category: "Backend",
    features: ["Postgres", "Auth", "Realtime"],
    docsUrl: "https://supabase.com/docs",
    lastActivity: "Setup paused",
    accent: "emerald",
  },
  {
    id: "aws",
    name: "AWS",
    summary: "Infrastructure, queues, storage, and serverless workloads.",
    icon: AWSIcon,
    category: "Cloud",
    features: ["S3", "Lambda", "EC2"],
    docsUrl: "https://aws.amazon.com/docs",
    lastActivity: "Ready to connect",
    accent: "amber",
  },
  {
    id: "azure",
    name: "Azure",
    summary: "Enterprise app services, functions, and managed storage.",
    icon: AzureIcon,
    category: "Cloud",
    features: ["App services", "Functions", "Storage"],
    docsUrl: "https://azure.microsoft.com/docs",
    lastActivity: "Ready to connect",
    accent: "blue",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    summary: "Cloud Run, analytics, AI services, and production infrastructure.",
    icon: GCPIcon,
    category: "Cloud",
    features: ["Cloud Run", "BigQuery", "AI APIs"],
    docsUrl: "https://cloud.google.com/docs",
    lastActivity: "Token expired",
    accent: "red",
  },
];

const statusMeta = {
  connected: {
    label: "Connected",
    detail: "Healthy",
    icon: CheckCircle2,
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    detail: "Needs setup",
    icon: Clock3,
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-300",
  },
  error: {
    label: "Error",
    detail: "Action needed",
    icon: AlertCircle,
    badge: "border-red-500/20 bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
  disconnected: {
    label: "Not connected",
    detail: "Optional",
    icon: Link2,
    badge: "border-[#2a2a2a] bg-[#202020] text-[#8a8a8a]",
    dot: "bg-[#525252]",
  },
};

const accentClasses = {
  neutral: "bg-[#202020] border-[#333333] text-[#ededed]",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  blue: "bg-sky-500/10 border-sky-500/20 text-sky-300",
  red: "bg-red-500/10 border-red-500/20 text-red-300",
};

function normalizeStatus(status) {
  return status || "disconnected";
}

function ConnectionStat({ icon: Icon, label, value, sublabel, tone = "neutral" }) {
  const toneClasses = {
    neutral: "text-[#e7e7e7]",
    emerald: "text-emerald-400",
    amber: "text-amber-300",
    red: "text-red-400",
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-[#e7e7e7] transition-colors hover:border-[#3a3a3a]">
      <div className="flex items-center gap-2 text-[#737373]">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#202020]">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={cn("mt-3 text-2xl font-semibold", toneClasses[tone])}>
        {value}
      </div>
      <p className="mt-1 text-xs text-[#525252]">{sublabel}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = statusMeta[normalizeStatus(status)];
  const StatusIcon = meta.icon;

  return (
    <Badge className={cn("h-6 gap-1.5 rounded-md px-2 text-[10px] font-semibold", meta.badge)}>
      <StatusIcon className="h-3 w-3" />
      {meta.label}
    </Badge>
  );
}

function ConnectionAction({ status, integrationId, onConnect, onDisconnect, onManage }) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "connected") {
    return (
      <>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onManage(integrationId)}
          className="h-8 border-[#2a2a2a] bg-[#202020] px-3 text-xs text-[#e7e7e7] hover:border-[#3a3a3a] hover:bg-[#2a2a2a]"
        >
          <Settings className="h-3.5 w-3.5" />
          Manage
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => onDisconnect(integrationId)}
          className="h-8 w-8 text-[#737373] hover:bg-red-500/10 hover:text-red-300"
          title="Disconnect"
        >
          <Unlink className="h-3.5 w-3.5" />
        </Button>
      </>
    );
  }

  if (normalizedStatus === "pending") {
    return (
      <Button
        type="button"
        size="sm"
        onClick={() => onConnect(integrationId)}
        className="h-8 bg-[#ededed] px-3 text-xs text-[#111111] hover:bg-white"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Continue
      </Button>
    );
  }

  if (normalizedStatus === "error") {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onConnect(integrationId)}
        className="h-8 border-red-500/20 bg-red-500/10 px-3 text-xs text-red-300 hover:bg-red-500/15 hover:text-red-200"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={() => onConnect(integrationId)}
      className="h-8 bg-[#ededed] px-3 text-xs text-[#111111] hover:bg-white"
    >
      Connect
    </Button>
  );
}

function IntegrationRow({ integration, status, onConnect, onDisconnect, onManage }) {
  const Icon = integration.icon;
  const normalizedStatus = normalizeStatus(status);
  const meta = statusMeta[normalizedStatus];

  return (
    <div className="group px-4 py-4 transition-colors hover:bg-[#202020]/70 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
              accentClasses[integration.accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[#ededed]">
                {integration.name}
              </h3>
              <span className="hidden text-[#3a3a3a] sm:inline">/</span>
              <StatusBadge status={normalizedStatus} />
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
              {integration.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {integration.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-md border border-[#2a2a2a] bg-[#161616] px-2 py-1 text-[10px] font-medium text-[#737373]"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#242424] bg-[#161616] p-3 text-xs lg:w-[230px]">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#525252]">
              Type
            </p>
            <p className="mt-1 truncate font-medium text-[#a3a3a3]">
              {integration.category}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#525252]">
              State
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              <span className="truncate font-medium text-[#a3a3a3]">
                {meta.detail}
              </span>
            </div>
          </div>
          <div className="col-span-2 border-t border-[#242424] pt-2">
            <p className="truncate text-[#666666]">{integration.lastActivity}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <Button
            asChild
            size="icon-sm"
            variant="ghost"
            className="h-8 w-8 text-[#737373] hover:bg-[#2a2a2a] hover:text-[#ededed]"
            title={`${integration.name} documentation`}
          >
            <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>

          <div className="flex items-center gap-2">
            <ConnectionAction
              status={normalizedStatus}
              integrationId={integration.id}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onManage={onManage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NextStepItem({ integration, status }) {
  const normalizedStatus = normalizeStatus(status);
  const meta = statusMeta[normalizedStatus];
  const Icon = integration.icon;
  const copy = {
    pending: "Finish the OAuth handoff",
    error: "Refresh credentials and retry",
    disconnected: "Connect when this service is needed",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#242424] bg-[#161616] p-3">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", accentClasses[integration.accent])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-xs font-medium text-[#ededed]">
            {integration.name}
          </span>
          <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
        </div>
        <p className="mt-0.5 truncate text-[11px] text-[#666666]">
          {copy[normalizedStatus]}
        </p>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-[#525252]" />
    </div>
  );
}

export function ConnectivityScreen() {
  const [connections, setConnections] = useState({
    github: "connected",
    vercel: "connected",
    supabase: "pending",
    aws: null,
    azure: null,
    gcp: "error",
  });

  const statusCounts = useMemo(() => {
    return integrations.reduce(
      (counts, integration) => {
        const status = normalizeStatus(connections[integration.id]);
        counts[status] += 1;
        return counts;
      },
      { connected: 0, pending: 0, error: 0, disconnected: 0 },
    );
  }, [connections]);

  const handleConnect = (integrationId) => {
    setConnections((prev) => ({
      ...prev,
      [integrationId]: "pending",
    }));

    window.setTimeout(() => {
      setConnections((prev) => ({
        ...prev,
        [integrationId]: "connected",
      }));
    }, 1200);
  };

  const handleDisconnect = (integrationId) => {
    setConnections((prev) => ({
      ...prev,
      [integrationId]: null,
    }));
  };

  const handleManage = () => {};

  const connectedCount = statusCounts.connected;
  const issueCount = statusCounts.pending + statusCounts.error;
  const progress = Math.round((connectedCount / integrations.length) * 100);
  const nextSteps = integrations.filter(
    (integration) => normalizeStatus(connections[integration.id]) !== "connected",
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ConnectionStat
          icon={CheckCircle2}
          label="Connected"
          value={connectedCount}
          sublabel={`of ${integrations.length} services active`}
          tone="emerald"
        />
        <ConnectionStat
          icon={Clock3}
          label="Pending"
          value={statusCounts.pending}
          sublabel="waiting on setup"
          tone="amber"
        />
        <ConnectionStat
          icon={AlertCircle}
          label="Needs attention"
          value={statusCounts.error}
          sublabel="credential or sync issue"
          tone="red"
        />
        <ConnectionStat
          icon={Database}
          label="Available"
          value={statusCounts.disconnected}
          sublabel="ready to connect"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#e7e7e7]">
          <div className="flex flex-col gap-4 border-b border-[#2a2a2a] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#202020] text-[#a3a3a3]">
                <Link2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-[#ededed]">
                  Project connections
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#737373]">
                  External services that power deploys, data, infrastructure, and automation.
                </p>
              </div>
            </div>
            <Badge className="h-7 w-fit gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-2.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {connectedCount} of {integrations.length} active
            </Badge>
          </div>

          <div className="divide-y divide-[#2a2a2a]">
            {integrations.map((integration) => (
              <IntegrationRow
                key={integration.id}
                integration={integration}
                status={connections[integration.id]}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onManage={handleManage}
              />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#ededed]">
                  Connection health
                </h3>
                <p className="mt-1 text-xs text-[#666666]">
                  {issueCount === 0 ? "All linked services are healthy." : `${issueCount} service${issueCount === 1 ? "" : "s"} need a look.`}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#202020] text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-[#737373]">Coverage</span>
                <span className="font-medium text-[#ededed]">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-[#2a2a2a] bg-[#111111]">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-[#242424] bg-[#161616] px-2 py-2">
                <p className="text-sm font-semibold text-emerald-400">{statusCounts.connected}</p>
                <p className="mt-0.5 text-[10px] text-[#666666]">active</p>
              </div>
              <div className="rounded-lg border border-[#242424] bg-[#161616] px-2 py-2">
                <p className="text-sm font-semibold text-amber-300">{statusCounts.pending}</p>
                <p className="mt-0.5 text-[10px] text-[#666666]">pending</p>
              </div>
              <div className="rounded-lg border border-[#242424] bg-[#161616] px-2 py-2">
                <p className="text-sm font-semibold text-red-400">{statusCounts.error}</p>
                <p className="mt-0.5 text-[10px] text-[#666666]">errors</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#ededed]">
                  Next steps
                </h3>
                <p className="mt-1 text-xs text-[#666666]">
                  Finish the connections that unblock project automation.
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-[#525252]" />
            </div>

            <div className="space-y-2">
              {nextSteps.slice(0, 3).map((integration) => (
                <NextStepItem
                  key={integration.id}
                  integration={integration}
                  status={connections[integration.id]}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4 h-9 w-full border-[#2a2a2a] bg-[#202020] text-xs text-[#a3a3a3] hover:border-[#3a3a3a] hover:bg-[#2a2a2a] hover:text-[#ededed]"
            >
              Review connection policy
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
