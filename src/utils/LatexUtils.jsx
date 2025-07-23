import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

function tokenizeMath(input) {
  const tokens = [];
  let lastIndex = 0;

  // Matches $$...$$, $...$, \(...\), or \[...\]
  const regex =
    /(\$\$)([\s\S]+?)(\$\$)|(\$)([^$]+?)(\$)|\\\((.+?)\\\)|\\\[([\s\S]+?)\\\]/g;

  let match;
  while ((match = regex.exec(input)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Push preceding plain text
    if (matchStart > lastIndex) {
      tokens.push({ kind: 'text', value: input.slice(lastIndex, matchStart) });
    }

    if (match[1] === '$$') {
      tokens.push({ kind: 'math-block', value: match[2] || '' });
    } else if (match[4] === '$') {
      tokens.push({ kind: 'math-inline', value: match[5] || '' });
    } else if (match[7] !== undefined) {
      tokens.push({ kind: 'math-inline', value: match[7] });
    } else if (match[8] !== undefined) {
      tokens.push({ kind: 'math-block', value: match[8] });
    }

    lastIndex = matchEnd;
  }

  // Add trailing text
  if (lastIndex < input.length) {
    tokens.push({ kind: 'text', value: input.slice(lastIndex) });
  }

  return tokens;
}

export function renderInlineMathText(value, keyPrefix = 'txt') {
  const tokens = tokenizeMath(value);
  return (
    <>
      {tokens.map((t, i) => {
        const key = `${keyPrefix}-${i}`;
        if (t.kind === 'text') return <React.Fragment key={key}>{t.value}</React.Fragment>;
        if (t.kind === 'math-inline') return <InlineMath key={key} math={t.value} />;
        if (t.kind === 'math-block') return <BlockMath key={key} math={t.value} />;
        return null;
      })}
    </>
  );
}