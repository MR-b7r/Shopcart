import { NextResponse } from "next/server";
import {
  createProduct,
  getProduct,
  getProducts,
} from "@/lib/actions/product.actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await createProduct(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const products = await getProducts({
      category: category ?? undefined,
      search: search ?? undefined,
    });

    return NextResponse.json(products, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
