import { useState, useRef } from 'react';
import { Bold, Italic, Underline, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + prefix.length + selectedText.length + suffix.length);
      } else {
        const newCursorPos = start + prefix.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);

      // Check for bullet list
      const bulletMatch = currentLine.match(/^(\s*)-\s/);
      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];
        const newText = value.substring(0, start) + '\n' + indent + '- ' + value.substring(start);
        onChange(newText);
        setTimeout(() => {
          const newPos = start + indent.length + 3;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }
    }
  };

  const handleBold = () => insertFormatting('**', '**');
  const handleItalic = () => insertFormatting('*', '*');
  const handleUnderline = () => insertFormatting('<u>', '</u>');
  
  const handleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText) {
      // Convert selected lines to bullet list
      const lines = selectedText.split('\n');
      const bulletLines = lines.map(line => line.trim() ? `- ${line.trim()}` : line).join('\n');
      const newText = value.substring(0, start) + bulletLines + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + bulletLines.length);
      }, 0);
    } else {
      // Insert bullet at cursor
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      if (start === lineStart) {
        insertFormatting('- ', '');
      } else {
        insertFormatting('\n- ', '');
      }
    }
  };
  
  const handleLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || 'link';
      
      insertFormatting(`[${selectedText}](${url})`, '');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Toolbar */}
      <div className="inline-flex items-center gap-1 p-1.5 bg-secondary/30 rounded-lg border border-border/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-7 w-7 p-0 hover:bg-primary/10"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-7 w-7 p-0 hover:bg-primary/10"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnderline}
          className="h-7 w-7 p-0 hover:bg-primary/10"
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </Button>
        
        <div className="w-px h-5 bg-border mx-0.5" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBulletList}
          className="h-7 w-7 p-0 hover:bg-primary/10"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full min-h-[120px] p-4 rounded-lg border bg-background resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'text-sm leading-relaxed',
          isFocused ? 'border-primary/50' : 'border-border/30'
        )}
      />
    </div>
  );
}
