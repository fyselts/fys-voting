
// Levenshtein distance calculation
export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    const row = matrix[i];
    if (row) row[0] = i;
  }

  // increment each column in the first row
  const firstRow = matrix[0];
  if (firstRow) {
    for (let j = 0; j <= a.length; j++) {
      firstRow[j] = j;
    }
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const rowI = matrix[i];
      const rowIPrev = matrix[i - 1];
      if (!rowI || !rowIPrev) continue;

      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        rowI[j] = rowIPrev[j - 1] ?? i + j; // Fallback should technically not happen if initialized correctly
      } else {
        const sub = (rowIPrev[j - 1] ?? 0) + 1;
        const ins = (rowI[j - 1] ?? 0) + 1;
        const del = (rowIPrev[j] ?? 0) + 1;
        rowI[j] = Math.min(sub, Math.min(ins, del));
      }
    }
  }

  const lastRow = matrix[b.length];
  return lastRow ? (lastRow[a.length] ?? b.length) : b.length;
}

export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\u00C0-\u00FF]/g, '');
}

export function tokenize(name: string): string[] {
  return name.toLowerCase().split(/[^a-z0-9\u00C0-\u00FF]+/).filter(Boolean);
}

export function areNamesSimilar(inputName: string, dbName: string): boolean {
  const input = inputName.trim();
  const db = dbName.trim();

  if (!input || !db) return false;

  // 1. Exact Match (case-insensitive)
  if (input.toLowerCase() === db.toLowerCase()) return true;

  const flatInput = normalizeName(input);
  const flatDb = normalizeName(db);

  // 2. Flat String Match (covers separator diffs, concatenation diffs, small typos)
  // "mari-liis" vs "mariliis" -> same flat string
  // "mari liis" vs "mariliis" -> same flat string
  // Allow small distance (e.g. <= 2 chars or <= 20% length)
  const dist = levenshtein(flatInput, flatDb);
  const len = Math.max(flatInput.length, flatDb.length);
  if (dist <= 2 || dist / len <= 0.2) return true;

  // 3. Subset / Component Match (covers omission: "mari maasikas" vs "mari liis maasikas")
  // All semantic parts of the Input should be present in the DB name.

  // We try to match tokens.
  // However, input tokens might be concatenated compared to DB tokens OR split.
  // "mariliis" (tok) matches "mari" (tok) + "liis" (tok).
  // So simple token intersection is hard.

  // But since we handled Concatenation/Split in Step 2 (Flat Match),
  // Step 2 handles: "mariliis" vs "mari liis" (dist 0).

  // Step 3 only needs to handle OMISSION: "mari maasikas" vs "mari liis maasikas".
  // Here, `flatInput` ("marimaasikas") is a SUBSEQUENCE of `flatDb` ("mariliismaasikas").
  // Is subsequence check sufficient?
  // "Al" is subsequence of "Alex". Login "Al" matches "Alex". Dangerous?
  // Login requires Email. So we only distinguish between users who share an email?
  // Emails are unique. So we are confirming identity against the SINGLE user found by email.
  // If I type "Mari" and the user is "Mari Liis", it's probably me.
  // If I type "Al" and the user is "Alex", it's probably me being lazy.
  // The risk is low because Email is providing the security. The Name is a "Can you confirm your name?" check.
  // But let's be slightly stricter than raw subsequence.
  // Let's require that `input` tokens match `db` tokens.

  const inputTokens = tokenize(input);
  const dbTokens = tokenize(db);

  // For every input token, it must "fuzzy match" one of the DB tokens OR a combination.
  // But again, simple token matching misses "mari-liis maasikas" (db) vs "mari maasikas" (input).
  // DB tokens: "mari", "liis", "maasikas". Input: "mari", "maasikas".
  // "mari" matches "mari". "maasikas" matches "maasikas". Valid.

  // What if Input: "mariliis maasikas". DB: "mari liis maasikas".
  // Input tokens: "mariliis", "maasikas".
  // "maasikas" matches. "mariliis" doesn't match single DB token.
  // WE NEED TO HANDLE COMBOS IF WE USE TOKEN MATCHING.

  // Alternative: Remove matched parts from Flat Strings?
  // "mariliismaasikas" (db). "marimaasikas" (in).
  // Remove "mari" -> "liismaasikas".
  // Remove "maasikas" -> "liis".
  // Remainder "liis".
  // Since we removed everything from Input, and DB has leftovers, it's a SUBSET match.
  // This seems robust.

  // Heuristic: Can we form `flatInput` by concatenating a subset of `dbTokens`?
  // No, `dbTokens` might be split ("m", "a", "r", "i").

  // Let's go back to: verify every INPUT token matches some DB token(s).
  // To support "mariliis" (input) matching "mari", "liis" (db):
  // Check if inputToken matches a concatenation of available dbTokens.

  const usedDbIndices = new Set<number>();

  for (const inToken of inputTokens) {
    let found = false;

    // 1. Single Token Match
    for (let i = 0; i < dbTokens.length; i++) {
      const dbToken = dbTokens[i];
      if (usedDbIndices.has(i) || !dbToken) continue;
      // Fuzzy match token
      if (levenshtein(inToken, dbToken) <= 1) {
        usedDbIndices.add(i);
        found = true;
        break;
      }
    }

    if (found) continue;

    // 2. Combo Match (Input "mariliis" matches DB "mari"+"liis")
    // Try to match inToken against any concatenation of unused DB tokens
    // This is greedy, but effectively we just need existence.
    for (let i = 0; i < dbTokens.length; i++) {
      const tokenI = dbTokens[i];
      if (usedDbIndices.has(i) || !tokenI) continue;

      for (let j = 0; j < dbTokens.length; j++) {
        const tokenJ = dbTokens[j];
        if (i === j || usedDbIndices.has(j) || !tokenJ) continue;

        // Try i+j
        if (levenshtein(inToken, tokenI + tokenJ) <= 1) {
          usedDbIndices.add(i);
          usedDbIndices.add(j);
          found = true;
          break;
        }

        // Try j+i? (Order usually matters but let's be safe)
        if (levenshtein(inToken, tokenJ + tokenI) <= 1) {
          usedDbIndices.add(i);
          usedDbIndices.add(j);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) continue;

    // 3. Reverse Combo Match (Input "mari" matches DB "mariliis"?)
    // If the user inputs a partial name that is PART of a DB token.
    // e.g. Input "mari", DB "mariliis".
    // This is implicit if we accept partial parts? 
    // "mari" is effectively a subset of "mariliis".
    // Check if `inToken` is a significant substring of any `dbToken`.
    for (let i = 0; i < dbTokens.length; i++) {
      const dbToken = dbTokens[i];
      // Don't mark as used? Or mark as used?
      // "mari maasikas" (in) vs "mariliis maasikas" (db).
      // "mari" matches part of "mariliis". "maasikas" matches "maasikas".
      // If "mari" consumes "mariliis", is that okay?
      // Yes.
      if (usedDbIndices.has(i)) continue;
      if (dbToken && dbToken.includes(inToken) && inToken.length > 2) {
        // Maybe strict: only if it matches start?
        // "mari" starts "mariliis".
        usedDbIndices.add(i);
        found = true;
        break;
      }
    }

    if (found) continue;

    return false; // Input token has no explanation in DB
  }

  return true;
}
