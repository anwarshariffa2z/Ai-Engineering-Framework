// Minimal YAML reader for the front matter subset the framework metadata standard
// permits: scalars, inline bracket lists, block maps, and block lists of maps.
// It is deliberately narrow. Anything it cannot parse is reported as a parse
// failure rather than guessed at, per STD-0012 fail-closed behaviour.

const SCALAR = /^([A-Za-z_][A-Za-z0-9_.]*):\s*(.*)$/;
const LIST_ITEM = /^-\s+(.*)$/;

function stripQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function parseInlineList(value) {
  const inner = value.trim().slice(1, -1).trim();
  if (inner === '') return [];
  return inner.split(',').map((entry) => stripQuotes(entry));
}

function indentOf(line) {
  return line.length - line.trimStart().length;
}

// Reads `key: value` from a trimmed line, tolerating a quoted key.
// Returns [key, value] or null.
function readKey(raw) {
  const quoted = /^"([^"]+)":\s*(.*)$/.exec(raw);
  if (quoted) return [quoted[1], quoted[2]];
  const plain = SCALAR.exec(raw);
  return plain ? [plain[1], plain[2]] : null;
}

function assign(target, key, value) {
  target[key] = value.trim().startsWith('[') ? parseInlineList(value) : stripQuotes(value);
}

// Parses a block starting at `start` whose entries are indented deeper than `parentIndent`.
// Returns [value, nextIndex].
function parseBlock(lines, start, parentIndent) {
  const first = lines[start];
  if (first === undefined) return [null, start];

  if (LIST_ITEM.test(first.trim())) {
    const items = [];
    let i = start;
    const itemIndent = indentOf(first);
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '') { i += 1; continue; }
      if (indentOf(line) < itemIndent) break;
      const listMatch = LIST_ITEM.exec(line.trim());
      if (!listMatch || indentOf(line) !== itemIndent) break;

      const head = listMatch[1];
      const headScalar = SCALAR.exec(head);
      if (headScalar) {
        // A list of maps: the first key sits on the dash line, the rest below.
        // Entry values may themselves be inline lists or nested blocks, which is
        // what artifact type declarations require.
        const entry = {};
        assign(entry, headScalar[1], headScalar[2]);
        i += 1;
        while (i < lines.length) {
          const next = lines[i];
          if (next.trim() === '') { i += 1; continue; }
          if (indentOf(next) <= itemIndent) break;
          const keyIndent = indentOf(next);
          const keyMatch = readKey(next.trim());
          if (!keyMatch) break;
          const [key, value] = keyMatch;
          if (value === '') {
            const [nested, nextIndex] = parseBlock(lines, i + 1, keyIndent);
            entry[key] = nested === null ? '' : nested;
            i = nested === null ? i + 1 : nextIndex;
          } else {
            assign(entry, key, value);
            i += 1;
          }
        }
        items.push(entry);
      } else {
        items.push(stripQuotes(head));
        i += 1;
      }
    }
    return [items, i];
  }

  const map = {};
  let i = start;
  const keyIndent = indentOf(first);
  if (keyIndent <= parentIndent) return [null, start];

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i += 1; continue; }
    if (indentOf(line) < keyIndent) break;
    if (indentOf(line) > keyIndent) break;

    const raw = line.trim();
    const quotedKey = /^"([^"]+)":\s*(.*)$/.exec(raw);
    const match = quotedKey ? [null, quotedKey[1], quotedKey[2]] : SCALAR.exec(raw);
    if (!match) break;

    const key = match[1];
    const value = match[2];
    if (value === '') {
      const [nested, nextIndex] = parseBlock(lines, i + 1, keyIndent);
      map[key] = nested === null ? '' : nested;
      i = nested === null ? i + 1 : nextIndex;
    } else if (value.startsWith('[')) {
      map[key] = parseInlineList(value);
      i += 1;
    } else {
      map[key] = stripQuotes(value);
      i += 1;
    }
  }
  return [map, i];
}

export function parseFrontMatter(text) {
  const normalised = text.replace(/\r\n/g, '\n');
  if (!normalised.startsWith('---\n')) {
    return { ok: false, reason: 'front matter does not open with a delimiter' };
  }
  const end = normalised.indexOf('\n---', 3);
  if (end === -1) {
    return { ok: false, reason: 'front matter is not closed by a delimiter' };
  }
  const block = normalised.slice(4, end);
  const lines = block.split('\n');
  try {
    const [map] = parseBlock(lines, 0, -1);
    if (map === null || typeof map !== 'object' || Array.isArray(map)) {
      return { ok: false, reason: 'front matter did not parse as a mapping' };
    }
    return { ok: true, data: map, keyOrder: orderedKeys(lines), body: normalised.slice(end + 4) };
  } catch (error) {
    return { ok: false, reason: `front matter parse error: ${error.message}` };
  }
}

function orderedKeys(lines) {
  const keys = [];
  for (const line of lines) {
    if (indentOf(line) !== 0) continue;
    const match = SCALAR.exec(line.trim());
    if (match) keys.push(match[1]);
  }
  return keys;
}
