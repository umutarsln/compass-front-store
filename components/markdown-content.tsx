"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from "@/lib/utils"

export interface MarkdownContentProps {
  content: string
  className?: string
  /** Ürün detay sayfası: gövde metni site varsayılanı (sans) ile hizalanır */
  variant?: "default" | "product"
}

/**
 * Markdown içeriğini proje tipografisiyle render eder.
 * @param variant "product" ürün detayında okunabilir gövde ve başlık hiyerarşisi kullanır
 */
export function MarkdownContent({ content, className = "", variant = "default" }: MarkdownContentProps) {
  const isProduct = variant === "product"
  const rootClass = isProduct
    ? "markdown-content font-sans text-[15px] sm:text-base text-foreground leading-[1.65] antialiased"
    : "markdown-content text-sm text-muted-foreground leading-relaxed [&_h2]:font-display [&_h3]:font-display"

  return (
    <div className={cn(rootClass, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className={cn(
                "text-foreground first:mt-0",
                isProduct
                  ? "font-display text-xl sm:text-2xl font-bold mt-6 mb-3"
                  : "text-2xl font-bold mt-6 mb-4",
              )}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className={cn(
                "text-foreground pb-2 border-b border-border/70",
                isProduct
                  ? "font-display text-lg sm:text-xl font-semibold mt-8 mb-3 first:mt-0"
                  : "text-xl font-bold mt-7 mb-3",
              )}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className={cn(
                "text-foreground",
                isProduct
                  ? "font-display text-base sm:text-lg font-semibold mt-6 mb-2"
                  : "text-lg font-semibold mt-5 mb-2",
              )}
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className={cn(
                "font-semibold text-foreground",
                isProduct ? "text-sm sm:text-base mt-4 mb-2" : "text-base mt-3 mb-2",
              )}
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5 className={cn("font-semibold text-foreground mt-2 mb-1", isProduct && "text-sm")} {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className={cn(
                "font-semibold mt-2 mb-1",
                isProduct ? "text-xs sm:text-sm text-foreground/80" : "text-muted-foreground",
              )}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className={cn(
                "mb-4 last:mb-0",
                isProduct ? "text-foreground" : "",
              )}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className={cn(
                "list-disc mb-4 space-y-2 pl-1 marker:text-primary",
                isProduct ? "list-outside ml-5 sm:ml-6" : "list-inside",
              )}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className={cn(
                "list-decimal mb-4 space-y-2 pl-1 marker:text-primary",
                isProduct ? "list-outside ml-5 sm:ml-6" : "list-inside",
              )}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              className={cn(
                "leading-7",
                isProduct ? "text-foreground pl-1" : "text-muted-foreground",
              )}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className={cn(
                "border-l-4 pl-4 py-2 my-4 italic rounded-r",
                isProduct
                  ? "border-primary/40 bg-primary/[0.06] text-foreground/95"
                  : "border-primary/30 text-muted-foreground bg-secondary/30",
              )}
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) => {
            const codeBg = isProduct ? "bg-primary/10" : "bg-secondary/50"
            return inline ? (
              <code
                className={cn("rounded px-1.5 py-0.5 font-mono text-sm text-foreground", codeBg)}
                {...props}
              />
            ) : (
              <code
                className={cn(
                  "block rounded p-4 font-mono text-sm text-foreground overflow-x-auto my-4",
                  codeBg,
                )}
                {...props}
              />
            )
          },
          pre: ({ node, ...props }) => (
            <pre
              className={cn(
                "rounded p-4 font-mono text-sm overflow-x-auto my-4",
                isProduct ? "bg-primary/10" : "bg-secondary/50",
              )}
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table
              className="w-full border-collapse border border-border my-4"
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead className={isProduct ? "bg-primary/10" : "bg-secondary/50"} {...props} />
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
