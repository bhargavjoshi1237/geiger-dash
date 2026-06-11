"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye, Download as DownloadIcon, ArrowUpDown, MoreHorizontal, Pencil, Copy,
  Share2, Link2Icon, FolderInput, ArchiveIcon, Trash2,
} from "lucide-react";
import { mediaItems, typeIcons, typeColors } from "./data";

function FileActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-text-tertiary hover:text-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-[#1e1e1e] border-border text-foreground">
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <Eye className="w-4 h-4 mr-2 text-text-secondary" /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <DownloadIcon className="w-4 h-4 mr-2 text-text-secondary" /> Download
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-surface-hover" />
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <Pencil className="w-4 h-4 mr-2 text-text-secondary" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <Copy className="w-4 h-4 mr-2 text-text-secondary" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <Share2 className="w-4 h-4 mr-2 text-text-secondary" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <Link2Icon className="w-4 h-4 mr-2 text-text-secondary" /> Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <FolderInput className="w-4 h-4 mr-2 text-text-secondary" /> Move to...
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-surface-hover" />
        <DropdownMenuItem className="text-sm focus:bg-surface-active focus:text-foreground cursor-pointer">
          <ArchiveIcon className="w-4 h-4 mr-2 text-text-secondary" /> Archive
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm focus:bg-surface-active text-red-400 focus:text-red-400 cursor-pointer">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MediaTable() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface-subtle">
      <Table>
        <TableHeader className="bg-[#1e1e1e]">
          <TableRow className="border-border hover:bg-[#1e1e1e]">
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Size</TableHead>
            <TableHead className="text-muted-foreground">Uploaded By</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Usage</TableHead>
            <TableHead className="text-muted-foreground w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediaItems.map((item) => {
            const IconComp = typeIcons[item.type];
            return (
              <TableRow key={item.id} className="border-border hover:bg-surface-active cursor-pointer">
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <IconComp className={"w-4 h-4 " + typeColors[item.type]} />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.type}</TableCell>
                <TableCell className="text-muted-foreground">{item.size}</TableCell>
                <TableCell className="text-muted-foreground">{item.uploadedBy}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{item.uploadedAt}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.usageCount}
                  </div>
                </TableCell>
                <TableCell>
                  <FileActionsDropdown />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}



