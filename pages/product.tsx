"use client"

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function IdeaGenerator() {
    const [idea, setIdea] = useState<string>('Loading...');

    useEffect(() => {
        async function generateIdea() {
            try {
                const response = await fetch('/api/idea');
                const data = await response.json() as { idea?: string; error?: string };

                if (!response.ok || !data.idea) {
                    throw new Error(data.error ?? 'Unable to generate a business idea.');
                }

                setIdea(data.idea);
            } catch (error) {
                setIdea(error instanceof Error ? error.message : 'Unable to generate a business idea.');
            }
        }

        void generateIdea();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Business Idea Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    AI-powered innovation at your fingertips
                </p>
            </header>

            {/* Content Card */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
                    {idea === 'Loading...' ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-pulse text-gray-400">
                                Generating your business idea...
                            </div>
                        </div>
                    ) : (
                        <div className="markdown-content text-gray-700 dark:text-gray-300">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                            >
                                {idea}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Product() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* User Menu in Top Right */}
            <div className="absolute top-4 right-4">
                <UserButton showName={true} />
            </div>

            <SignedIn>
                <IdeaGenerator />
            </SignedIn>
            <SignedOut>
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Sign in to generate ideas
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                        Create an account or sign in to access the business idea generator.
                    </p>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                            Sign In
                        </button>
                    </SignInButton>
                    <Link className="ml-4 text-blue-700 hover:underline" href="/">
                        Back to home
                    </Link>
                </div>
            </SignedOut>
        </main>
    );
}