"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { logout } from "@/app/login/actions";
import { useState } from "react";

export function LogoutButton() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-100 h-9 w-9"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Sign out</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Are you sure you want to sign out of your account?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2"></div>
        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border-zinc-700"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20"
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
