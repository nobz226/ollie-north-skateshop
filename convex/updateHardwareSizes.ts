import { mutation } from "./_generated/server";

export default mutation({
  args: {},
  handler: async (ctx) => {
    // Get all hardware products
    const allProducts = await ctx.db.query("products").collect();
    
    // Define size mappings based on product names
    const sizeUpdates = [
      { name: "Allen Head Mounting Bolts - Black", size: "7/8\"" },
      { name: "Phillips Head Mounting Bolts - Silver", size: "1\"" },
      { name: "Colored Hardware Set - Red", size: "1\"" },
      { name: "Black Diamond Griptape", size: "9\" x 33\"" },
      { name: "Clear Perforated Griptape", size: "9\" x 33\"" },
      { name: "Colored Griptape - Blue", size: "9\" x 33\"" },
      { name: "Shock Absorbing Risers - 1/8\"", size: "1/8\"" },
      { name: "Angled Wedge Risers - 1/4\"", size: "1/4\"" },
      { name: "Soft Rubber Risers - 1/2\"", size: "1/2\"" },
      { name: "ABEC 7 Bearings", size: "ABEC 7" },
      { name: "ABEC 9 Bearings", size: "ABEC 9" },
      { name: "Ceramic Bearings - Pro Series", size: "Ceramic" },
    ];
    
    let updatedCount = 0;
    
    for (const update of sizeUpdates) {
      const product = allProducts.find(p => p.name === update.name);
      if (product) {
        await ctx.db.patch(product._id, { size: update.size });
        updatedCount++;
        console.log(`Updated ${product.name} with size: ${update.size}`);
      }
    }
    
    return { 
      success: true, 
      message: `Updated ${updatedCount} hardware products with sizes`,
      updatedCount 
    };
  },
});
