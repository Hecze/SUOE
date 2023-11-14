import { NextResponse } from "next/server";

export function Get(request, { params }){
    return NextResponse.json({
        message: "obteniendo laboratorios!",
        params,
    });
}