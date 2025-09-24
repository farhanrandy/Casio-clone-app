import ProductModel from "@/db/models/ProductModel";
export async function GET() {
  const products = await ProductModel.getAll();
  return Response.json(products);
}
