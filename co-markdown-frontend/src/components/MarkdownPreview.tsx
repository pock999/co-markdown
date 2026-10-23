import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({
  content,
}: MarkdownPreviewProps) {
  return (
    <article
      className="
        min-w-0 break-words text-sm leading-7 text-[#334138]
        [&_a]:text-[#315d48] [&_a]:underline
        [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#c5d6a3] [&_blockquote]:pl-4 [&_blockquote]:text-[#667269]
        [&_code]:rounded [&_code]:bg-[#f2f1eb] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]
        [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-[#202b25]
        [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#202b25]
        [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#202b25]
        [&_hr]:my-6 [&_hr]:border-[#e7e5dc] [&_img]:h-auto [&_img]:max-w-full
        [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:my-3
        [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#f8f7f0] [&_pre]:p-4
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse
        [&_td]:border [&_td]:border-[#e7e5dc] [&_td]:px-3 [&_td]:py-2
        [&_th]:border [&_th]:border-[#e7e5dc] [&_th]:bg-[#f8f7f0] [&_th]:px-3 [&_th]:py-2
        [&_ul]:my-3
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
