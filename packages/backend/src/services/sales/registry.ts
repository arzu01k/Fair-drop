import type { SaleInfo } from "../../types.js";

// Single scripted sale for the hackathon demo. The `saleStart` is resolved to
// "sale opens shortly" when clients hit /sale/active so every demo run shows
// a countdown from the product card.
const NIKE_SALE: Omit<SaleInfo, "saleStart"> = {
  productId: "nike-air-max-limited",
  name: "Nike Air Max Limited",
  edition: "Blitz Special",
  priceUsd: 220,
  totalStock: 100,
};

export const getActiveSale = (): SaleInfo => ({
  ...NIKE_SALE,
  saleStart: Date.now() + 15_000,
});
