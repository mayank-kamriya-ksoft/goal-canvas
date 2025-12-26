import { ReactNode } from "react";
import { Header } from "./Header";
import { EditorHeader } from "./EditorHeader";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  useEditorHeader?: boolean;
  boardTitle?: string;
  onTitleChange?: (title: string) => void;
}

export function Layout({ 
  children, 
  hideFooter = false, 
  useEditorHeader = false,
  boardTitle,
  onTitleChange 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {useEditorHeader ? (
        <EditorHeader boardTitle={boardTitle} onTitleChange={onTitleChange} />
      ) : (
        <Header />
      )}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
