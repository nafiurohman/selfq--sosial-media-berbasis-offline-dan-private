// Simple markdown to HTML parser
export function parseMarkdown(text: string): string {
  let html = text;
  
  // Escape HTML first (but preserve <u> tags)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/<(?!\/?(u)>)/g, '&lt;')
    .replace(/(?<!<\/?u)>/g, '&gt;');
  
  // Bold: **text** (must be before italic to avoid conflict)
  html = html.replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>');
  
  // Italic: *text* (but not **)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/gs, '<em>$1</em>');
  
  // Bullet lists: - item
  html = html.replace(/^-\s+(.+)$/gm, '<li style="margin-left: 1.5rem;">$1</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li style="margin-left: 1\.5rem;">.*?<\/li>\n?)+/g, (match) => {
    return `<ul style="list-style-type: disc; padding-left: 1.5rem;">${match}</ul>`;
  });
  
  // Links: [text](url)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
  
  return html;
}
