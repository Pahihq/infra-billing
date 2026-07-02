import type { ReactNode } from 'react';

// Neutral theme palette: keys pop in foreground, values keep restrained hues that read on
// both the white light bg and the dark card/popover; punctuation stays muted (see <pre> below).
const CLS = {
  key: 'text-foreground',
  string: 'text-teal-700 dark:text-teal-300',
  number: 'text-blue-600 dark:text-blue-300',
  boolean: 'text-amber-600 dark:text-amber-300',
  nul: 'text-muted-foreground',
};

// Tokenize pretty-printed JSON into colored spans. Safe by construction (no innerHTML).
function highlight(json: string): ReactNode[] {
  const re =
    /("(?:\\.|[^"\\])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (let m = re.exec(json); m !== null; m = re.exec(json)) {
    if (m.index > last) out.push(json.slice(last, m.index));
    const tok = m[0];
    let cls: string;
    if (tok.startsWith('"')) cls = tok.trimEnd().endsWith(':') ? CLS.key : CLS.string;
    else if (tok === 'true' || tok === 'false') cls = CLS.boolean;
    else if (tok === 'null') cls = CLS.nul;
    else cls = CLS.number;
    out.push(
      <span key={key} className={cls}>
        {tok}
      </span>,
    );
    key += 1;
    last = re.lastIndex;
  }
  if (last < json.length) out.push(json.slice(last));
  return out;
}

/** Pretty, syntax-highlighted, scrollable view of an arbitrary JSON value. */
export function JsonView({ data, maxHeight = 460 }: { data: unknown; maxHeight?: number }) {
  const text = JSON.stringify(data, null, 2);
  return (
    <pre
      className="m-0 overflow-auto rounded-lg border bg-muted p-3 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-muted-foreground"
      style={{ maxHeight }}
    >
      {highlight(text)}
    </pre>
  );
}
