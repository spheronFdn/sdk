export default async function eraseLines(numberOfLines: number) {
  const ansiEscapes = await import("ansi-escapes");
  return ansiEscapes.default.eraseLines(numberOfLines);
}
