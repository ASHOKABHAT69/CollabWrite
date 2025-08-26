
"use client";

import * as React from "react"
import { Bold, Italic, List, ListOrdered, Strikethrough, Pilcrow, Type, Baseline, Underline } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PageLayout } from "@/app/documents/[id]/page";
import { cn } from "@/lib/utils";


interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditing: boolean;
  pageLayout: PageLayout;
}

const fontFamilies = [
  { name: 'Inter', css: 'Inter, sans-serif' },
  { name: 'Space Grotesk', css: "'Space Grotesk', sans-serif" },
  { name: 'Georgia', css: 'Georgia, serif' },
  { name: 'Courier New', css: "'Courier New', monospace" },
  { name: 'Arial', css: 'Arial, sans-serif' },
  { name: 'Verdana', css: 'Verdana, sans-serif' },
];

const fontSizes = ['1', '2', '3', '4', '5', '6', '7'];
const fontDisplaySizes = ['8px', '10px', '12px', '14px', '18px', '24px', '32px'];


export function DocumentEditor({ content, onContentChange, isEditing, pageLayout }: DocumentEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [currentFont, setCurrentFont] = React.useState("Inter");
  const isInternalUpdate = React.useRef(false);

  // This effect syncs the parent's content to the editor's innerHTML
  // ONLY when the component loads or the content prop changes from the outside.
  React.useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML && !isInternalUpdate.current) {
        editorRef.current.innerHTML = content;
    }
    isInternalUpdate.current = false;
  }, [content]);

  const handleInput = () => {
    if (editorRef.current && isEditing) {
        isInternalUpdate.current = true;
        onContentChange(editorRef.current.innerHTML);
    }
  };
  
  const handleSelectionChange = React.useCallback(() => {
    if (!isEditing || !editorRef.current) return;

    const updateFont = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        let node = selection.getRangeAt(0).startContainer;
        
        // Traverse up to find the element node if the start is a text node
        if (node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentNode!;
        }

        if (node && node instanceof HTMLElement && editorRef.current?.contains(node)) {
            const computedStyle = window.getComputedStyle(node);
            const fontFamily = computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
            const matchingFont = fontFamilies.find(f => f.name.toLowerCase() === fontFamily.toLowerCase() || f.css.toLowerCase().includes(fontFamily.toLowerCase()));
            setCurrentFont(matchingFont ? matchingFont.name : "Mixed");
        }
    };
    
    // Using setTimeout to allow the selection to properly update in the DOM first
    setTimeout(updateFont, 0);

  }, [isEditing]);


  React.useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);


  const applyCommand = (command: string, value?: string) => {
    if (editorRef.current && isEditing) {
        editorRef.current.focus();
        document.execCommand(command, false, value);
        handleInput(); // Manually trigger update after command
    }
  };
  
  const handleFontSizeChange = (size: string) => {
    applyCommand('fontSize', size);
  }

  const editorLayoutClasses = {
      'page-A1': 'w-[2245px] min-h-[3175px]',
      'page-A2': 'w-[1587px] min-h-[2245px]',
      'page-A3': 'w-[1123px] min-h-[1587px]',
      'page-A4': 'w-[794px] min-h-[1123px]',
      'page-A5': 'w-[559px] min-h-[794px]',
      'page-auto': 'w-full min-h-[calc(100vh-18rem)]',
  }

  return (
    <div className="container mx-auto">
      <Card className="shadow-lg">
        {isEditing && (
          <div className="p-2 border-b sticky top-[60px] bg-background z-10 flex flex-wrap items-center gap-1">
            <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('bold')} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('italic')} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('underline')} title="Underline">
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('strikeThrough')} title="Strikethrough">
              <Strikethrough className="h-4 w-4" />
            </Button>
             <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('formatBlock', '<p>')} title="Paragraph">
                <Pilcrow className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('insertUnorderedList')} title="Unordered List">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand('insertOrderedList')} title="Ordered List">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-36 justify-start" onMouseDown={(e) => e.preventDefault()}>
                    <Type className="mr-2 h-4 w-4" />
                    <span className="truncate">{currentFont}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onFocusOutside={(e) => e.preventDefault()}>
                {fontFamilies.map(font => (
                  <DropdownMenuItem key={font.name} onMouseDown={(e) => e.preventDefault()} onSelect={() => applyCommand('fontName', font.css)} style={{fontFamily: font.css}}>
                    {font.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-28 justify-start" onMouseDown={(e) => e.preventDefault()}>
                  <Baseline className="mr-2 h-4 w-4" />
                  <span>Font Size</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onFocusOutside={(e) => e.preventDefault()}>
                {fontSizes.map((size, index) => (
                  <DropdownMenuItem key={size} onMouseDown={(e) => e.preventDefault()} onSelect={() => handleFontSizeChange(size)}>
                     <span style={{fontSize: fontDisplaySizes[index]}}>{fontDisplaySizes[index]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <CardContent className="p-4 bg-gray-100 dark:bg-gray-800 flex justify-center">
            <div
                ref={editorRef}
                contentEditable={isEditing}
                onInput={handleInput}
                className={cn(
                    "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl focus:outline-none dark:prose-invert bg-card p-8 shadow-md",
                     editorLayoutClasses[`page-${pageLayout}`]
                )}
            />
        </CardContent>
      </Card>
    </div>
  )
}
