export async function GET() {
    console.log("✅ Test route hit!");
    return Response.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
}