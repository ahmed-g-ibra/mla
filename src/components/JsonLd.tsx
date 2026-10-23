/**
 * Renders a schema.org graph into the document.
 *
 * `<` is escaped because a literal `</script>` anywhere in the payload would
 * close the tag early. Nothing here is user-supplied today, but the catalogue
 * is generated from a scrape and that is not a guarantee worth relying on.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
