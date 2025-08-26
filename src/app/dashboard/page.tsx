
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, FileText } from 'lucide-react'
import { Header } from '@/components/common/Header'
import { NewDocumentDialog } from '@/components/dashboard/NewDocumentDialog'

const initialDocuments = [
  { id: '1', title: 'Project Proposal Q3', lastUpdated: '2 days ago', collaborators: 3, description: 'Drafting the project proposal for the upcoming quarter, focusing on market expansion.' },
  { id: '2', title: 'Technical Specification - API V2', lastUpdated: '5 hours ago', collaborators: 5, description: 'Detailed technical specs for the new version of our primary API.' },
  { id: '3', title: 'Marketing Campaign Strategy', lastUpdated: '1 week ago', collaborators: 2, description: 'Brainstorming and outlining the marketing strategy for the new product launch.' },
  { id: '4', title: 'Onboarding Manual for New Hires', lastUpdated: '3 days ago', collaborators: 4, description: 'A comprehensive guide for new employees to get up to speed quickly.' },
];

export type Document = {
  id: string;
  title: string;
  lastUpdated: string;
  collaborators: number;
  description: string;
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedDocs = localStorage.getItem('collabwrite-documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    } else {
      setDocuments(initialDocuments);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem('collabwrite-documents', JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  const handleAddDocument = (title: string) => {
    const newDoc: Document = {
      id: (Date.now()).toString(),
      title,
      lastUpdated: 'Just now',
      collaborators: 1,
      description: 'A new document ready for collaboration.',
    };
    setDocuments(prevDocs => [newDoc, ...prevDocs]);
  };

  if (!isLoaded) {
      return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-headline">Your Documents</h1>
            <NewDocumentDialog onAddDocument={handleAddDocument}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </NewDocumentDialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <FileText className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <span className="font-headline">{doc.title}</span>
                  </CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="w-full flex justify-between text-sm text-muted-foreground">
                    <span>Updated {doc.lastUpdated}</span>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{doc.collaborators}</span>
                    </div>
                  </div>
                  <Link href={`/documents/${doc.id}`} className="w-full">
                    <Button variant="outline" className="w-full">Open Document</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
