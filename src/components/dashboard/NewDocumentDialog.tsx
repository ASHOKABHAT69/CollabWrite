"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

export function NewDocumentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [collaborators, setCollaborators] = React.useState<string[]>([""])

  const handleAddCollaborator = () => {
    setCollaborators([...collaborators, ""])
  }

  const handleCollaboratorChange = (index: number, value: string) => {
    const newCollaborators = [...collaborators]
    newCollaborators[index] = value
    setCollaborators(newCollaborators)
  }

  const handleRemoveCollaborator = (index: number) => {
    const newCollaborators = collaborators.filter((_, i) => i !== index)
    setCollaborators(newCollaborators)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Document</DialogTitle>
          <DialogDescription>
            Give your new document a title and invite collaborators.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-title" className="text-right">
              Title
            </Label>
            <Input
              id="doc-title"
              placeholder="My new document"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Collaborators</Label>
            <div className="col-span-3 space-y-2">
              {collaborators.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder="collaborator@example.com"
                    value={email}
                    onChange={(e) =>
                      handleCollaboratorChange(index, e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCollaborator(index)}
                    disabled={collaborators.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCollaborator}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Collaborator
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
