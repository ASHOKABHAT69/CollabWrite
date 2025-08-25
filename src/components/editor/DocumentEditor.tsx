import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function DocumentEditor({ content, onContentChange }: DocumentEditorProps) {
  return (
    <div className="container mx-auto">
       <Card className="shadow-lg">
        <CardContent className="p-2">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[calc(100vh-14rem)] w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-base"
            placeholder="Start writing your document..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
