import { NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/actions/category.actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const category = await createCategory(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await getCategories();

    return NextResponse.json(categories, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
