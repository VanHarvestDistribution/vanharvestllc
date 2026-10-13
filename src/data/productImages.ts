import { yellowLabelProductImages } from './yellowLabelProductImages';
import { studioProductImages } from './studioProductImages';

/**
 * One image per Item #. A white-background studio image (public/images/products/ai/)
 * takes priority over a warehouse yellow-label photo for the same item.
 * Any product with an entry here gets a detail page.
 */
export const productImages: Record<string, string> = { ...yellowLabelProductImages, ...studioProductImages };

/** Studio images are representative, not photos of the exact packed product. */
export const isRepresentativeImage = (itemId: string) => Boolean(studioProductImages[String(itemId)]);
