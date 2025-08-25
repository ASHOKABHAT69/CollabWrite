"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { getSmartSuggestions } from "@/lib/actions"
import { Sparkles, Wand2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SmartSuggestionsProps {
  documentContent: string
}

const exampleQueries = [
  "Help me structure the introduction",
  "Suggest some counter-arguments",
  "Summarize the key points",
  "Suggest a concluding paragraph"
];

export function SmartSuggestions({ documentContent }: SmartSuggestionsProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setSuggestions([])

    const response = await getSmartSuggestions({
      documentContent,
      userQuery: query,
    })

    if (response.success && response.suggestions) {
      setSuggestions(response.suggestions)
    } else {
      setError(response.error || "Failed to get suggestions.")
    }
    setIsLoading(false)
  }

  const handleExampleQueryClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-1 space-y-4">
        <Textarea
          placeholder="What do you need help with? e.g., 'Help me structure the introduction'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-2">Or try one of these:</p>
            <div className="flex flex-wrap gap-2">
                {exampleQueries.map(example => (
                    <button 
                        key={example}
                        onClick={() => handleExampleQueryClick(example)}
                        className="px-2 py-1 bg-muted hover:bg-muted/80 rounded-md text-xs"
                    >
                        {example}
                    </button>
                ))}
            </div>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading || !query} className="w-full">
          {isLoading ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Suggestions
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 my-4">
        <div className="p-1 space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </>
          )}
          {error && (
            <Alert variant="destructive">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-4 text-sm">
                <p>{suggestion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
