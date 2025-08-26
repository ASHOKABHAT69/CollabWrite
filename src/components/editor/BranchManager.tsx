
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { GitBranch, Plus } from "lucide-react"

interface BranchManagerProps {
  branches: string[];
  currentBranch: string;
  onCreateBranch: (newBranchName: string) => void;
  onBranchChange: (branchName: string) => void;
}

export function BranchManager({ branches, currentBranch, onCreateBranch, onBranchChange }: BranchManagerProps) {
  const [newBranchName, setNewBranchName] = useState("")

  const handleCreateBranch = () => {
    onCreateBranch(newBranchName);
    setNewBranchName("");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <GitBranch className="mr-2 h-4 w-4" />
          <span>{currentBranch}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Branches</h4>
            <p className="text-sm text-muted-foreground">
              Manage and switch between different versions of your document.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex flex-col space-y-2">
              {branches.map((branch) => (
                <Button
                  key={branch}
                  variant={branch === currentBranch ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => onBranchChange(branch)}
                >
                  <GitBranch className="mr-2 h-4 w-4" />
                  {branch}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-2">
                <Input 
                  id="new-branch" 
                  placeholder="Create new branch..." 
                  className="h-9"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                />
                <Button size="icon" className="h-9 w-9" onClick={handleCreateBranch} disabled={!newBranchName || branches.includes(newBranchName)}>
                    <Plus className="h-4 w-4"/>
                    <span className="sr-only">Create Branch</span>
                </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
