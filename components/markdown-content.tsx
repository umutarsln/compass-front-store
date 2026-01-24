"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`markdown-content text-sm text-muted-foreground leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-foreground mt-6 mb-4 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold text-foreground mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-semibold text-foreground mt-3 mb-2" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="font-semibold text-foreground mt-2 mb-1" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="font-semibold text-muted-foreground mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 last:mb-0" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-muted-foreground" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary/30 pl-4 py-2 my-4 italic text-muted-foreground bg-secondary/30 rounded-r"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="bg-secondary/50 rounded px-1.5 py-0.5 font-mono text-sm text-foreground"
                {...props}
              />
            ) : (
              <code
                className="block bg-secondary/50 rounded p-4 font-mono text-sm text-foreground overflow-x-auto my-4"
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre className="bg-secondary/50 rounded p-4 font-mono text-sm overflow-x-auto my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <table
              className="w-full border-collapse border border-border my-4"
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-secondary/50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border border-border" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border px-4 py-2 font-semibold text-foreground text-left" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img
              className="max-w-full h-auto rounded my-4"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-t border-border" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
