/**
 * One 8×8 limestone-to-papyrus wash, 114 bytes, shared by every photograph on
 * the site.
 *
 * Per-image blur hashes would match each photo more closely, but 262 of them
 * would add roughly a quarter of a megabyte to the product data and some 50KB
 * to the collections payload alone — paid for on Gulf mobile data. These
 * photographs are almost all shot on white, so a single warm placeholder reads
 * correctly behind them and costs nothing.
 */
export const IMAGE_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAOUlEQVR42mP49uExVsTw6fVdrIjh/fPrWBHD68cXsSKGF/dOY0UMT24dxYoYHl7bjxUx3Lu0CysCAKwqphlWIndvAAAAAElFTkSuQmCC';
