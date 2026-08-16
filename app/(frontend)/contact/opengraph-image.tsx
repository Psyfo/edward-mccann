// The site's share card, for this route.
//
// Next only merges a metadata image into a page that declares its own
// openGraph if the image belongs to the same route segment. These pages set
// openGraph so they can carry their own address, which drops the card
// inherited from the layout, so each segment re-exports it.
export { default, alt, size, contentType } from "../opengraph-image";
