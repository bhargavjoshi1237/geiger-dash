"use client";

// The file browser. Its whole job is to show the two things at once: the tidy
// logical tree a consumer app sees, and the provider each file's bytes actually
// sit on. Uploading here runs the same reserve -> transfer -> commit path a
// suite app does.

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Folder,
  FileIcon,
  ChevronRight,
  Upload,
  Copy,
  Trash2,
  MoreHorizontal,
  Move,
  ExternalLink,
  Loader2,
  Home,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  LogoLoading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SearchInput,
} from "@geiger/ui";
import { cn } from "@/lib/utils";
import { formatBytes, formatRelative, normalizePath } from "@/lib/filestore/utils";
import { runUploadTicket } from "@/lib/filestore/client-upload";
import {
  listNodesAction,
  deleteNodeAction,
  migrateNodeAction,
  beginAdminUploadAction,
  commitAdminUploadAction,
} from "@/lib/filestore/actions";

function parentPath(path) {
  const segments = path.split("/").filter(Boolean);
  segments.pop();
  return segments.length ? `/${segments.join("/")}` : "/";
}

export function BrowserPanel({
  namespaces,
  providers,
  initialNodes,
  initialNamespaceId,
}) {
  const [namespaceId, setNamespaceId] = useState(initialNamespaceId);
  const [nodes, setNodes] = useState(initialNodes || []);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("/");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const fileInput = useRef(null);

  const namespace = namespaces.find((item) => item.id === namespaceId) || null;

  useEffect(() => {
    if (!namespaceId || namespaceId === initialNamespaceId) return;

    let cancelled = false;
    setLoading(true);
    listNodesAction(namespaceId).then((result) => {
      if (cancelled) return;
      setNodes(result.nodes || []);
      setPath("/");
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [namespaceId, initialNamespaceId]);

  async function refresh() {
    const result = await listNodesAction(namespaceId);
    setNodes(result.nodes || []);
  }

  // Search flattens the whole namespace; otherwise we show one folder's children.
  const entries = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term) {
      return nodes.filter(
        (node) => node.kind === "file" && node.path.toLowerCase().includes(term)
      );
    }

    return nodes
      .filter((node) => parentPath(node.path) === path)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [nodes, path, search]);

  const crumbs = useMemo(() => {
    const segments = path.split("/").filter(Boolean);
    return segments.map((segment, index) => ({
      name: segment,
      path: `/${segments.slice(0, index + 1).join("/")}`,
    }));
  }, [path]);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !namespaceId) return;

    setUploading(true);
    const target = normalizePath(`${path === "/" ? "" : path}/${file.name}`);
    let stage = "reservation";
    let uploadId = null;

    try {
      // 1. reserve — the pool picks a provider and debits the capacity.
      const started = await beginAdminUploadAction({
        namespaceId,
        path: target,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        overwrite: true,
      });

      if (!started.ok) throw new Error(started.error);
      uploadId = started.uploadId;

      // 2. transfer — straight to the provider, following the ticket.
      stage = "transfer";
      const transferred = await runUploadTicket({
        ticket: started.ticket,
        mode: started.mode,
        file,
      });

      // 3. commit — settle the ledger and mint the file map.
      stage = "commit";
      const committed = await commitAdminUploadAction({
        uploadId: started.uploadId,
        parts: transferred.parts,
        response: transferred.response,
        providerKey: transferred.providerKey,
      });

      if (!committed.ok) throw new Error(committed.error);

      toast.success(
        `${file.name} stored on ${committed.file.placement?.provider || "the pool"}.`
      );
      await refresh();
    } catch (err) {
      console.error("[filestore.adminUpload]", {
        stage, uploadId, fileName: file.name, sizeBytes: file.size,
        mimeType: file.type || "application/octet-stream",
      }, err);
      toast.error(`Upload failed during ${stage}: ${err.message || "Unknown error."}`, {
        duration: 12000,
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(node) {
    setBusyId(node.id);
    const result = await deleteNodeAction(node.id);
    setBusyId(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${node.name} deleted and its bytes returned to the pool.`);
    await refresh();
  }

  async function handleMigrate(node, providerId) {
    setBusyId(node.id);
    const result = await migrateNodeAction({ nodeId: node.id, targetProviderId: providerId });
    setBusyId(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${node.name} moved — its path and link are unchanged.`);
    await refresh();
  }

  function copy(text, label) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied.`);
  }

  if (namespaces.length === 0) {
    return (
      <EmptyState
        title="No namespaces yet"
        description="Each consumer app gets its own namespace — its own root, its own tree. Create one from the Keys tab, where you also mint the key it uploads with."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={namespaceId || ""} onValueChange={setNamespaceId}>
          <SelectTrigger className="w-[220px] bg-surface-card">
            <SelectValue placeholder="Pick a namespace" />
          </SelectTrigger>
          <SelectContent>
            {namespaces.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name || item.key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search this namespace…"
          className="w-full sm:w-64"
        />

        <div className="ml-auto flex items-center gap-2">
          {namespace && (
            <span className="text-xs text-text-tertiary">
              {formatBytes(namespace.usedBytes)} · {namespace.objectCount} objects
            </span>
          )}
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="gap-1.5 bg-primary"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
      </div>

      {!search && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setPath("/")}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-surface-hover hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            {namespace?.key || "root"}
          </button>
          {crumbs.map((crumb) => (
            <span key={crumb.path} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
              <button
                type="button"
                onClick={() => setPath(crumb.path)}
                className="rounded px-1.5 py-0.5 hover:bg-surface-hover hover:text-foreground"
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <LogoLoading size={56} />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          title={search ? "No files match" : "This folder is empty"}
          description={
            search
              ? "Try a different search term."
              : "Upload a file and the pool will decide where it physically lands."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-subtle">
          {entries.map((node, index) => (
            <div
              key={node.id}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-hover",
                index > 0 && "border-t border-border"
              )}
            >
              {node.kind === "folder" ? (
                <button
                  type="button"
                  onClick={() => setPath(node.path)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                >
                  <Folder className="h-4 w-4 shrink-0 text-text-tertiary" />
                  <span className="truncate text-sm text-foreground">{node.name}</span>
                </button>
              ) : (
                <>
                  <FileIcon className="h-4 w-4 shrink-0 text-text-tertiary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      {search ? node.path : node.name}
                    </p>
                    <p className="truncate text-[11px] text-text-tertiary">
                      {node.mimeGroup} · {formatRelative(node.createdAt)}
                      {node.status !== "ready" ? ` · ${node.status}` : ""}
                    </p>
                  </div>

                  {/* The point of the whole system: logical path on the left,
                      physical home right here. */}
                  {node.placement && (
                    <span className="hidden shrink-0 rounded-full border border-border bg-surface-active px-2 py-0.5 text-[11px] text-text-secondary sm:inline">
                      {node.placement.providerName || node.placement.driver}
                    </span>
                  )}

                  <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                    {formatBytes(node.sizeBytes)}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${node.name}`}
                        disabled={busyId === node.id}
                      >
                        {busyId === node.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-border bg-surface-subtle"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          copy(
                            `${window.location.origin}/api/storage/f/${node.id}`,
                            "Gateway link"
                          )
                        }
                      >
                        <Copy className="mr-2 h-3.5 w-3.5" />
                        Copy link
                      </DropdownMenuItem>
                      {node.placement?.providerUrl && (
                        <DropdownMenuItem
                          onClick={() => copy(node.placement.providerUrl, "Direct link")}
                        >
                          <ExternalLink className="mr-2 h-3.5 w-3.5" />
                          Copy direct link
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-[11px] text-text-tertiary">
                        Move to provider
                      </DropdownMenuLabel>
                      {providers
                        .filter(
                          (provider) =>
                            provider.status === "active" &&
                            provider.id !== node.placement?.providerId
                        )
                        .map((provider) => (
                          <DropdownMenuItem
                            key={provider.id}
                            onClick={() => handleMigrate(node, provider.id)}
                          >
                            <Move className="mr-2 h-3.5 w-3.5" />
                            {provider.name}
                          </DropdownMenuItem>
                        ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="text-red-400 focus:bg-red-500/10"
                        onClick={() => handleDelete(node)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
