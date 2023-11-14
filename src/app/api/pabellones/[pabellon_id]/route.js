import { NextResponse } from "next/server";

export function GET(request, {params}){
    return NextResponse.json({
        message: `Este es el ${params.id}!`,
    });
}
