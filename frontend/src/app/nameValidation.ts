export function normalizeEntityName(name: string, label: string): string {
  const normalized = name.trim();

  if (!normalized) {
    throw new Error(`${label} name is required.`);
  }

  return normalized;
}
