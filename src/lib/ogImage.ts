// The site-wide share card, for pages that define their own `openGraph`
// metadata. Defining `openGraph` on a page replaces the inherited object AND
// suppresses the root `opengraph-image.jpg` file convention for that route, so
// such pages must re-attach the image explicitly. Pages that don't touch
// `openGraph` (the homepage) keep getting the file-convention tags and must NOT
// use this, or the tags are emitted twice. Alt mirrors opengraph-image.alt.txt.
export const OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Shoobydoo concert photography: a crowd silhouetted before a red-lit stage crossed by cyan laser beams.",
};
