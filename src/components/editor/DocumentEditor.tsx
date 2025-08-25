"use client";

import * as React from "react"
import { Bold, Italic, List, ListOrdered, Strikethrough, Pilcrow, Type, Baseline, Underline } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditing: boolean;
}

const fontFamilies = [
  { name: 'Inter', css: 'Inter, sans-serif' },
  { name: 'Space Grotesk', css: "'Space Grotesk', sans-serif" },
  { name: 'Georgia', css: 'Georgia, serif' },
  { name: 'Courier New', css: "'Courier New', monospace" },
  { name: 'Arial', css: 'Arial, sans-serif' },
  { name: 'Verdana', css: 'Verdana, sans-serif' },
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];


export function DocumentEditor({ content, onContentChange, isEditing }: DocumentEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // When editing mode starts, sync the editor's content with the prop.
    // Or if the content changes from outside while not editing.
    if (editorRef.current && isEditing && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [isEditing, content]);

  const handleBlur = () => {
    // When the user clicks away from the editor, sync the content back to parent state
    if(editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  }

  const applyCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if(editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  return (
    <div className="container mx-auto">
      <Card className="shadow-lg">
        {isEditing && (
          <div className="p-2 border-b sticky top-[60px] bg-background z-10 flex flex-wrap items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => applyCommand('bold')} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyCommand('italic')} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyCommand('underline')} title="Underline">
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyCommand('strikeThrough')} title="Strikethrough">
              <Strikethrough className="h-4 w-4" />
            </Button>
             <Button variant="ghost" size="icon" onClick={() => applyCommand('formatBlock', '<p>')} title="Paragraph">
                <Pilcrow className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => applyCommand('insertUnorderedList')} title="Unordered List">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyCommand('insertOrderedList')} title="Ordered List">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-32 justify-start">
                    <Type className="mr-2 h-4 w-4" />
                    <span>Font Family</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fontFamilies.map(font => (
                  <DropdownMenuItem key={font.name} onSelect={() => applyCommand('fontName', font.css)} style={{fontFamily: font.css}}>
                    {font.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-28 justify-start">
                  <Baseline className="mr-2 h-4 w-4" />
                  <span>Font Size</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fontSizes.map((size, index) => (
                  <DropdownMenuItem key={size} onSelect={() => applyCommand('fontSize', (index + 1).toString())}>
                     <span style={{fontSize: size}}>{size}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <CardContent 
          className="p-4"
        >
            <div
                ref={editorRef}
                contentEditable={isEditing}
                onBlur={handleBlur}
                className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto focus:outline-none min-h-[calc(100vh-18rem)] dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </CardContent>
      </Card>
    </div>
  )
}
