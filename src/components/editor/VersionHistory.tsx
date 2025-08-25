import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const versions = [
  { id: 'v5', message: 'Finalized Q3 goals and projections', author: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', timestamp: '5 hours ago', tag: 'Latest' },
  { id: 'v4', message: 'Added market analysis section', author: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob', timestamp: '1 day ago' },
  { id: 'v3', message: 'Revised project timeline', author: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', timestamp: '2 days ago' },
  { id: 'v2', message: 'Initial draft of proposal', author: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie', timestamp: '2 days ago' },
  { id: 'v1', message: 'Created document', author: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', timestamp: '3 days ago' },
];

export function VersionHistory() {
  return (
    <ScrollArea className="flex-1 -mx-6">
        <div className="flex flex-col gap-4 p-6">
            {versions.map(version => (
            <div key={version.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                        <AvatarImage src={version.avatar} alt={version.author} />
                        <AvatarFallback>{version.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{version.author}</span>
                    </div>
                    {version.tag && <Badge variant="secondary">{version.tag}</Badge>}
                </div>
                <p className="text-sm text-foreground mb-2">{version.message}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{version.timestamp}</span>
                    <Button variant="ghost" size="sm">Restore</Button>
                </div>
            </div>
            ))}
        </div>
    </ScrollArea>
  )
}
