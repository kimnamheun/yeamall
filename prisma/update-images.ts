import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugToImage: Record<string, string> = {
  "premium-roasted-anchovy-500g": "/images/products/anchovy-roasted.svg",
  "soup-large-anchovy-1kg": "/images/products/anchovy-soup.svg",
  "wind-dried-squid-10": "/images/products/squid-dried.svg",
  "shredded-hwangtae-300g": "/images/products/hwangtae.svg",
  "dried-shrimp-500g": "/images/products/shrimp-dried.svg",
  "wando-traditional-seaweed-100": "/images/products/seaweed-kim.svg",
  "natural-kelp-1kg": "/images/products/kelp.svg",
  "premium-nuts-gift-set": "/images/products/nuts-gift.svg",
  "small-anchovy-1kg": "/images/products/anchovy-small.svg",
  "grilled-squid-legs-300g": "/images/products/squid-legs.svg",
  "unsalted-almonds-1kg": "/images/products/almonds.svg",
  "dried-fish-gift-set-large": "/images/products/gift-set-large.svg",
};

async function main() {
  console.log("Updating product images...");

  for (const [slug, image] of Object.entries(slugToImage)) {
    const result = await prisma.product.updateMany({
      where: { slug },
      data: {
        images: [image],
        thumbnailUrl: image,
      },
    });
    console.log(`  ${slug}: ${result.count > 0 ? "updated" : "not found"}`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
