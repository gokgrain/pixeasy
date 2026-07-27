export function AdPlaceholder({ label }: { label: string }) {
  return <aside className="ad" aria-label={label}>{label}</aside>;
}
