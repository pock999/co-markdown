import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  return (
    <div className="h-full min-h-[320px] overflow-auto">
      <CodeMirror
        value={value}
        height="100%"
        minHeight="320px"
        extensions={[markdown()]}
        basicSetup={{ lineNumbers: false, foldGutter: false }}
        onChange={onChange}
        aria-label="Markdown 編輯器"
      />
    </div>
  );
}
