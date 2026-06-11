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
import { clearProfileImageCache } from "@/lib/profile-image-cache";
import { useState } from "react";

export function LogoutButton() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await clearProfileImageCache();
    await logout();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-9 w-9"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Sign out</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to sign out of your account?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2"></div>
        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-surface-hover text-muted-foreground hover:bg-surface-strong hover:text-foreground border-border-strong"
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
