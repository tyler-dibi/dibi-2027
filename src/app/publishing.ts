/** True on a published (built) site. Creating playgrounds only works locally, via the dev server. */
export const isPublished = import.meta.env.PROD;

/** The Git branch a published site was built from, e.g. "tyler-invoices". Undefined locally. */
export const publishedBranch = import.meta.env.VITE_PUBLISHED_BRANCH || undefined;
