import { deleteCategory, updateCategory } from "@/lib/actions/category.actions";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedCategory = await updateCategory({
      id: Number(id),
      data: body,
    });

    return NextResponse.json(updatedCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deletedCategory = await deleteCategory(Number(id));

    return NextResponse.json(deletedCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
