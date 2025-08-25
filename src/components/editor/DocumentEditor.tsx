import * as React from "react"
import { Bold, Italic, List, ListOrdered, Strikethrough, Pilcrow, Type, FontSize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from 'react-markdown';
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
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px'];

export function DocumentEditor({ content, onContentChange, isEditing }: DocumentEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [selection, setSelection] = React.useState<[number, number] | null>(null);
  const [currentFont, setCurrentFont] = React.useState(fontFamilies[0].css);
  const [currentFontSize, setCurrentFontSize] = React.useState('16px');


  const handleSelectionChange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        // This is a simplified way to get offsets. A real implementation would be more robust.
        const preSelectionRange = document.createRange();
        preSelectionRange.selectNodeContents(editorRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;

        preSelectionRange.setEnd(range.endContainer, range.endOffset);
        const end = preSelectionRange.toString().length;

        setSelection([start, end]);
      }
    }
  };

  const applyStyle = (style: 'bold' | 'italic' | 'strike' | 'ul' | 'ol' | 'p') => {
    if (!selection) return;

    const [start, end] = selection;
    const selectedText = content.substring(start, end);
    let newText;

    switch (style) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'strike':
        newText = `~~${selectedText}~~`;
        break;
      case 'ul':
        newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      case 'ol':
        newText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        break;
      case 'p':
        newText = `\n${selectedText}\n`;
        break;
      default:
        newText = selectedText;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    onContentChange(newContent);
  };
  
    const applyFont = (fontCss: string) => {
        // This is a simplified conceptual implementation.
        // In a real app, you would need a more complex state management for styles.
        setCurrentFont(fontCss);
    };

    const applyFontSize = (size: string) => {
        setCurrentFontSize(size);
    };


  return (
    <div className="container mx-auto">
      <Card className="shadow-lg">
        {isEditing && (
          <div className="p-2 border-b sticky top-0 bg-background z-10 flex flex-wrap items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => applyStyle('bold')} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyStyle('italic')} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyStyle('strike')} title="Strikethrough">
              <Strikethrough className="h-4 w-4" />
            </Button>
             <Button variant="ghost" size="icon" onClick={() => applyStyle('p')} title="Paragraph">
                <Pilcrow className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => applyStyle('ul')} title="Unordered List">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => applyStyle('ol')} title="Ordered List">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-32 justify-start">
                    <Type className="mr-2 h-4 w-4" />
                    <span>{fontFamilies.find(f => f.css === currentFont)?.name || 'Font'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fontFamilies.map(font => (
                  <DropdownMenuItem key={font.name} onSelect={() => applyFont(font.css)} style={{fontFamily: font.css}}>
                    {font.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-24 justify-start">
                  <FontSize className="mr-2 h-4 w-4" />
                  <span>{currentFontSize}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fontSizes.map(size => (
                  <DropdownMenuItem key={size} onSelect={() => applyFontSize(size)}>
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <CardContent 
          className="p-4" 
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
        >
          {isEditing ? (
             <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="min-h-[calc(100vh-22rem)] w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-base bg-transparent"
                style={{ fontFamily: currentFont, fontSize: currentFontSize }}
                placeholder="Start writing your document..."
              />
          ) : (
             <div
                ref={editorRef}
                className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto focus:outline-none min-h-[calc(100vh-18rem)]"
                style={{ fontFamily: currentFont, fontSize: currentFontSize }}
              >
                  <ReactMarkdown>{content}</ReactMarkdown>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
