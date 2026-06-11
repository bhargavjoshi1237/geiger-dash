"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  Plus,
  Mail,
  MoreHorizontal,
  Edit,
  DeleteIcon,
  Delete,
  Trash,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InviteMemberDialog } from "@/components/flow-playground/dilouges/teams/invitemember_dilouge";
import { createClient } from "@/lib/supabase/client-demo";
import { useProject } from "@/components/flow-playground/context/project-context-demo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MainScreenWrapper } from "@/components/flow-playground/shared/screen_wrappers";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/flow-playground/notfound/not_found";
import { Button } from "@/components/ui/button";

export function TeamScreen() {
  const { project } = useProject();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!project?.id) return;
      const supabase = createClient();
      console.log("[flow_teams] fetching team for project:", project.id);
      const { data, error } = await supabase
        .from("flow_teams")
        .select("*")
        .eq("id", project.id)
        .maybeSingle();

      if (error) {
        console.error(
          "[flow_teams] fetch error:",
          error.message || error,
          error.code,
        );
        // Handle specific error codes if necessary, e.g., if row not found
        if (error.code === "PGRST116") {
          // Example: code for no rows found
          setMembers([]); // Gracefully handle missing row by setting empty members
        }
      }

      if (data && data.members) {
        setMembers(
          Array.isArray(data.members)
            ? data.members
            : Object.values(data.members),
        );
      } else {
        setMembers([]); // Gracefully handle missing 'members' property or no data
      }
      setLoading(false);
    };
    fetchTeam();
  }, [project?.id]);

  if (!loading && members.length === 0) {
    const avatarStack = (
      <div className="flex -space-x-4 items-center -mr-0.5">
        <Avatar className="w-12 h-12 bg-surface-hover ring-4 ring-[#121212]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar className="w-12 h-12 bg-surface-hover ring-4 ring-[#121212]">
          <AvatarImage src="https://github.com/nutlope.png" />
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
        <Avatar className="w-12 h-12 bg-surface-hover ring-4 ring-[#121212]">
           <AvatarImage src="https://avatar.vercel.sh/shadcn" />
           <AvatarFallback>R</AvatarFallback>
        </Avatar>
      </div>
    );

    return (
      <MainScreenWrapper>
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-12">
          <EmptyState
            icon={avatarStack}
            title="No Team Members"
            description="Invite your team to collaborate on this project."
            actionLabel="Invite Members"
            onAction={() => setIsInviteOpen(true)}
          />
          <InviteMemberDialog 
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
            onInvite={handleInvite}
          />
        </div>
      </MainScreenWrapper>
    );
  }

  const saveMembers = async (newMembers) => {
    setMembers(newMembers);
    if (!project?.id) return;
    const supabase = createClient();
    await supabase
      .from("flow_teams")
      .upsert({ id: project.id, members: newMembers });
  };

  const handleInvite = (email, role) => {
    const newMember = {
      name: email.split("@")[0],
      email,
      role,
      status: "Active",
    };
    saveMembers([...members, newMember]);
  };

  const handleEditRole = (email, newRole) => {
    saveMembers(
      members.map((m) => (m.email === email ? { ...m, role: newRole } : m)),
    );
  };

  const handleRemove = (email) => {
    saveMembers(members.filter((m) => m.email !== email));
  };

  return (
    <MainScreenWrapper className="text-foreground">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their roles.
          </p>
        </div>
        <InviteMemberDialog onInvite={handleInvite}>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4 text-black font-bold stroke-[3]" />
            Invite member
          </button>
        </InviteMemberDialog>
      </div>
       

      <div className="bg-surface-card border border-border rounded-2xl overflow-hidden w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-subtle border-border">
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-foreground0"
                >
                  Loading team members...
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-foreground0"
                >
                  No members found. Invite someone to your team.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member, i) => (
                <TableRow
                  key={i}
                  className="border-border hover:bg-surface-active"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-xs font-medium text-white ring-1 ring-border-strong uppercase">
                        {member.name ? member.name.charAt(0) : "?"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground capitalize">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3 opacity-50" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-muted-foreground bg-surface-hover px-2 py-1 rounded border border-border capitalize">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="text-sm text-green-400 font-medium capitalize">
                        {member.status || "Active"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-surface-hover">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-surface-subtle border-border text-foreground"
                      >
                        <InviteMemberDialog
                          defaultEmail={member.email}
                          defaultRole={member.role}
                          isEditMode={true}
                          onInvite={(email, role) =>
                            handleEditRole(email, role)
                          }
                        >
                          <button className="w-full text-left flex gap-2 px-2 py-1.5 text-sm hover:bg-surface-hover hover:text-foreground transition-colors rounded-sm cursor-default">
                            <Edit className="w-4 h-4" /> Edit Role
                          </button>
                        </InviteMemberDialog>
                        <DropdownMenuItem
                          className="hover:bg-surface-hover  flex gap-2 focus:bg-surface-hover focus:text-foreground cursor-pointer text-red-700 focus:text-red-400"
                          onClick={() => handleRemove(member.email)}
                        >
                          <Trash className="w-4 h-4  text-red-700" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </MainScreenWrapper>
  );
}



