/** API origin for absolute image URLs in JSON (used by <img src> from another origin). */
export function apiBase(req) {
  const fromEnv = process.env.API_PUBLIC_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const host = req?.get?.("host");
  if (host) return `${req.protocol || "http"}://${host}`.replace(/\/$/, "");
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

/** Bare filename or `/images/...` → full URL */
export function imageUrl(req, image) {
  if (image == null || image === "") return image;
  if (typeof image !== "string") return image;

  let path = image.trim();
  if (/^https?:\/\//i.test(path)) return path;

  if (path.startsWith("/image/")) path = `/images/${path.slice(7)}`;
  else if (path.startsWith("uploads/")) path = `/${path}`;
  else if (!path.startsWith("/")) path = `/images/${encodeURIComponent(path)}`;

  return `${apiBase(req)}${path}`;
}

export function productJSON(req, doc) {
  const o = doc?.toObject ? doc.toObject({ flattenMaps: true }) : { ...doc };
  if (o.image != null && o.image !== "") {
    o.image = imageUrl(req, o.image);
  }
  return o;
}

export function cartJSON(req, doc) {
  const o = doc?.toObject ? doc.toObject({ flattenMaps: true }) : { ...doc };
  if (Array.isArray(o.cartItems)) {
    o.cartItems = o.cartItems.map((it) => ({
      ...it,
      image: it.image != null && it.image !== "" ? imageUrl(req, it.image) : it.image,
    }));
  }
  return o;
}

export function orderJSON(req, doc) {
  const o = doc?.toObject ? doc.toObject({ flattenMaps: true }) : { ...doc };
  if (Array.isArray(o.orderItems)) {
    o.orderItems = o.orderItems.map((it) => ({
      ...it,
      image: it.image != null && it.image !== "" ? imageUrl(req, it.image) : it.image,
    }));
  }
  return o;
}
