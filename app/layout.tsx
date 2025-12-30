import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduVerse Pro - Ultimate AI Study Platform',
  description: 'Complete study companion with AI chat, flashcards, quizzes, document generation, task management, and more. Excel in your studies with 12 powerful tools.',
  keywords: 'education, study tools, AI tutor, flashcards, quiz generator, student platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
