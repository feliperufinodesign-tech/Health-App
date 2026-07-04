"use client";

import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function ProfileMenu({ email }: { email: string | undefined }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="rounded-full transition-transform active:scale-95"
            aria-label="Abrir perfil"
          />
        }
      >
        <UserRound className="size-4" strokeWidth={1.75} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>{email ?? "Sem e-mail identificado"}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action="/auth/signout" method="post" className="w-full">
            <Button type="submit" variant="outline" className="w-full">
              Sair
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
