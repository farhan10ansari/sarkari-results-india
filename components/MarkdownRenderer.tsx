import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownRenderer - A customizable markdown renderer component
 * 
 * Features:
 * - GitHub Flavored Markdown support (tables, strikethrough, task lists, etc.)
 * - Customizable styling via props
 * - Proper rendering of lists, headings, code blocks, and more
 * - Dark mode support
 */
interface MarkdownRendererProps {
  /**
   * The markdown content to render
   */
  content: string;
  
  /**
   * Size variant: 'sm' | 'base' | 'lg'
   * @default 'base'
   */
  size?: 'sm' | 'base' | 'lg';
  
  /**
   * Text color class
   * @default 'text-slate-800 dark:text-slate-200'
   */
  textColor?: string;
  
  /**
   * Heading color class
   * @default 'text-slate-900 dark:text-white'
   */
  headingColor?: string;
  
  /**
   * Background color class
   * @default ''
   */
  backgroundColor?: string;
  
  /**
   * Padding class
   * @default ''
   */
  padding?: string;
  
  /**
   * Maximum width class
   * @default 'max-w-none'
   */
  maxWidth?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  size = 'base',
  textColor = 'text-slate-800 dark:text-slate-200',
  headingColor = 'text-slate-900 dark:text-white',
  backgroundColor = '',
  padding = '',
  maxWidth = 'max-w-none',
  className = '',
}) => {
  // Size-based prose classes
  const sizeClasses = {
    sm: 'prose-sm',
    base: 'prose-base',
    lg: 'prose-lg',
  };

  // Custom components for better rendering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components: any = {
    // Headings
    h1: ({ ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
      <h1 className={`text-3xl font-bold mt-6 mb-4 ${headingColor}`} {...props} />
    ),
    h2: ({ ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
      <h2 className={`text-2xl font-bold mt-5 mb-3 ${headingColor}`} {...props} />
    ),
    h3: ({ ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
      <h3 className={`text-xl font-bold mt-4 mb-2 ${headingColor}`} {...props} />
    ),
    h4: ({ ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
      <h4 className={`text-lg font-semibold mt-3 mb-2 ${headingColor}`} {...props} />
    ),
    h5: ({ ...props }: React.ComponentPropsWithoutRef<'h5'>) => (
      <h5 className={`text-base font-semibold mt-2 mb-2 ${headingColor}`} {...props} />
    ),
    h6: ({ ...props }: React.ComponentPropsWithoutRef<'h6'>) => (
      <h6 className={`text-sm font-semibold mt-2 mb-1 ${headingColor}`} {...props} />
    ),
    
    // Paragraphs
    p: ({ ...props }: React.ComponentPropsWithoutRef<'p'>) => (
      <p className={`mb-4 ${textColor}`} {...props} />
    ),
    
    // Lists
    ul: ({ ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
      <ul className={`list-disc list-inside mb-4 space-y-2 ml-4 ${textColor}`} {...props} />
    ),
    ol: ({ ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
      <ol className={`list-decimal list-inside mb-4 space-y-2 ml-4 ${textColor}`} {...props} />
    ),
    li: ({ ...props }: React.ComponentPropsWithoutRef<'li'>) => (
      <li className={`${textColor}`} {...props} />
    ),
    
    // Links
    a: ({ ...props }: React.ComponentPropsWithoutRef<'a'>) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    
    // Code blocks
    code: ({ inline, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono"
            {...props}
          />
        );
      }
      return (
        <code
          className="block p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono overflow-x-auto mb-4"
          {...props}
        />
      );
    },
    pre: ({ ...props }: React.ComponentPropsWithoutRef<'pre'>) => (
      <pre className="mb-4 overflow-x-auto" {...props} />
    ),
    
    // Blockquotes
    blockquote: ({ ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote
        className={`border-l-4 border-blue-500 pl-4 italic my-4 ${textColor}`}
        {...props}
      />
    ),
    
    // Horizontal rule
    hr: ({ ...props }: React.ComponentPropsWithoutRef<'hr'>) => (
      <hr className="my-6 border-slate-300 dark:border-slate-700" {...props} />
    ),
    
    // Tables
    table: ({ ...props }: React.ComponentPropsWithoutRef<'table'>) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700" {...props} />
      </div>
    ),
    thead: ({ ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
      <thead className="bg-slate-100 dark:bg-slate-800" {...props} />
    ),
    tbody: ({ ...props }: React.ComponentPropsWithoutRef<'tbody'>) => (
      <tbody {...props} />
    ),
    tr: ({ ...props }: React.ComponentPropsWithoutRef<'tr'>) => (
      <tr className="border-b border-slate-300 dark:border-slate-700" {...props} />
    ),
    th: ({ ...props }: React.ComponentPropsWithoutRef<'th'>) => (
      <th
        className="px-4 py-2 text-left font-semibold border border-slate-300 dark:border-slate-700"
        {...props}
      />
    ),
    td: ({ ...props }: React.ComponentPropsWithoutRef<'td'>) => (
      <td
        className={`px-4 py-2 border border-slate-300 dark:border-slate-700 ${textColor}`}
        {...props}
      />
    ),
    
    // Images
    img: ({ alt = '', ...props }: React.ComponentPropsWithoutRef<'img'>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="max-w-full h-auto rounded-lg my-4" alt={alt} {...props} />
    ),
    
    // Strong and emphasis
    strong: ({ ...props }: React.ComponentPropsWithoutRef<'strong'>) => (
      <strong className={`font-bold ${textColor}`} {...props} />
    ),
    em: ({ ...props }: React.ComponentPropsWithoutRef<'em'>) => (
      <em className={`italic ${textColor}`} {...props} />
    ),
  };

  const proseClass = sizeClasses[size];
  const combinedClasses = `prose ${proseClass} ${maxWidth} ${textColor} ${backgroundColor} ${padding} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};
