import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

// Step 1: Enhanced tokenizer
function tokenizeMathAndBold(input) {
  const tokens = [];
  let lastIndex = 0;

  // Matches math: $$...$$ | $...$ | \(..\) | \[..\]
  const mathRegex = /(\$\$)([\s\S]+?)(\$\$)|(\$)([^$]+?)(\$)|\\\((.+?)\\\)|\\\[([\s\S]+?)\\\]/g;

  let match;
  while ((match = mathRegex.exec(input)) !== null) {
    const matchStart = match.index;
    const matchEnd = mathRegex.lastIndex;

    if (matchStart > lastIndex) {
      const textSegment = input.slice(lastIndex, matchStart);
      tokens.push(...tokenizeBold(textSegment)); // tokenize bold inside text
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

  if (lastIndex < input.length) {
    tokens.push(...tokenizeBold(input.slice(lastIndex)));
  }

  return tokens;
}

// Step 2: Tokenize bold inside a plain text segment
function tokenizeBold(text) {
  const tokens = [];
  let lastIndex = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = boldRegex.lastIndex;

    if (matchStart > lastIndex) {
      tokens.push({ kind: 'text', value: text.slice(lastIndex, matchStart) });
    }

    tokens.push({ kind: 'bold', value: match[1] }); // bold content only
    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

// Step 3: Renderer
export function renderInlineMathText(value, keyPrefix = 'txt', px_size = 12) {
  const tokens = tokenizeMathAndBold(value);
  return (
    <>
      {tokens.map((t, i) => {
        const key = `${keyPrefix}-${i}`;
        if (t.kind === 'text')
          return <React.Fragment key={key}>{t.value}</React.Fragment>;

        if (t.kind === 'bold')
          return <strong key={key}>{t.value}</strong>;

        if (t.kind === 'math-inline')
          return (
            <span
              key={key}
              style={{ fontSize: `${px_size}px` }}
              className="inline sm:text-base"
            >
              <InlineMath math={t.value} />
            </span>
          );

        if (t.kind === 'math-block')
          return (
            <span
              key={key}
              style={{ fontSize: `${px_size}px` }}
              className="sm:text-base"
            >
              <BlockMath math={t.value} />
            </span>
          );

        return null;
      })}
    </>
  );
}
