"use client"

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Header } from "@/components/common/Header"
import { DocumentEditor } from "@/components/editor/DocumentEditor"
import { VersionHistory } from "@/components/editor/VersionHistory"
import { BranchManager } from "@/components/editor/BranchManager"
import { SmartSuggestions } from "@/components/editor/SmartSuggestions"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { History, Sparkles, GitBranch, Users, Share2, Edit, Save, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DocumentPage({ params }: { params: { id:string } }) {
  const [documentContent, setDocumentContent] = useState(
`<h1>Project Proposal Q3 - CollabWrite Draft</h1>

<h2>1. Introduction</h2>
<p>Welcome to <b>CollabWrite</b>, the real-time collaborative document platform. This document serves as a demonstration of its core features, including simultaneous editing, version control, and AI-powered assistance.</p>

<h2>2. Real-Time Collaboration</h2>
<p>Multiple users can edit this document at the same time. Cursors of other users will be visible, and changes will appear instantly. Our system handles conflicts automatically, ensuring a smooth editing experience.</p>

<h2>3. Version Control</h2>
<ul>
  <li><b>Branching:</b> Use the 'Branch' button to create a new version of this document without affecting the main draft.</li>
  <li><b>History:</b> Click 'Version History' to see all past changes and restore previous versions if needed.</li>
</ul>

<h2>4. Smart Suggestions</h2>
<p>Click the 'Smart Suggestions' button and ask the AI for help. For example, try asking it to "suggest a concluding paragraph for this proposal."</p>`
  );

  const [isEditing, setIsEditing] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadPdf = () => {
    const editorContent = editorContainerRef.current?.querySelector('.prose');
    if (editorContent) {
      html2canvas(editorContent as HTMLElement, {
        scale: 2,
        logging: true,
        useCORS: true,
        onclone: (document) => {
            // You can add styles to the cloned document if needed
        }
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save("document.pdf");
      }).catch(err => {
        console.error("Error generating PDF:", err);
      });
    } else {
        console.error("Could not find editor content to export.");
    }
  };


  const collaborators = [
    { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
    { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
    { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <BranchManager />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <History className="mr-2 h-4 w-4" /> Version History
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:w-[540px] flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="font-headline">Version History</SheetTitle>
                      <SheetDescription>Review and restore previous versions of this document.</SheetDescription>
                    </SheetHeader>
                    <VersionHistory />
                  </SheetContent>
                </Sheet>
                 {isEditing ? (
                  <Button onClick={() => setIsEditing(false)}>
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center -space-x-2">
                  {collaborators.map(user => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                         <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={handleDownloadPdf}>
                        <Download className="mr-2 h-4 w-4" />
                        Download as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Sparkles className="mr-2 h-4 w-4" /> Smart Suggestions
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:w-[540px] flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="font-headline">AI Smart Suggestions</SheetTitle>
                       <SheetDescription>Get AI-powered help to enhance your document.</SheetDescription>
                    </SheetHeader>
                    <SmartSuggestions documentContent={documentContent} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          <div ref={editorContainerRef}>
            <DocumentEditor
              content={documentContent}
              onContentChange={setDocumentContent}
              isEditing={isEditing}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
