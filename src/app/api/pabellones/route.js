import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Pabellon from "@/models/Pabellon";

export async function Get() {
  connectDB();

  const pabellones = await Pabellon.find();
  return NextResponse.json(pabellones);
}

export function Post() {
  connectDB();
  return NextResponse.json({
    message: "creando pabellon!",
  });
}
