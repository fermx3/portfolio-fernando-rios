// Structured data. Rendered as application/ld+json, which browsers never
// execute -- it is read by crawlers only.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
