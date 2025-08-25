import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditing: boolean;
}

export function DocumentEditor({ content, onContentChange, isEditing }: DocumentEditorProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const applyStyle = (style: 'bold' | 'italic' | 'strike' | 'ul' | 'ol') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
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
        }
        
        const newContent = content.substring(0, start) + newText + content.substring(end);
        onContentChange(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + 2;
            textarea.selectionEnd = start + 2 + selectedText.length;
        }, 0);
    };

  return (
    <div className="container mx-auto">
       <Card className="shadow-lg">
        {isEditing && (
            <div className="p-2 border-b">
                <div className="flex flex-wrap items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => applyStyle('bold')} title="Bold">
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => applyStyle('italic')} title="Italic">
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => applyStyle('strike')} title="Strikethrough">
                        <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                     <Button variant="ghost" size="icon" onClick={() => applyStyle('ul')} title="Unordered List">
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => applyStyle('ol')} title="Ordered List">
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )}
        <CardContent className="p-0">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[calc(100vh-18rem)] w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-base"
            placeholder="Start writing your document..."
            readOnly={!isEditing}
          />
        </CardContent>
      </Card>
    </div>
  )
}
