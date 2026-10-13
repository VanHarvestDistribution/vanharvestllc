/**
 * Featured Product IDs per department, edited from the /admin page.
 * Stored in featured.json; IDs without an image are skipped on the page.
 */
import featured from './featured.json';

export const curatedCategoryFeaturedIds: Record<string, string[]> = featured;
