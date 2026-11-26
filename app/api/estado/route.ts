export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      estado: "ok",
      entorno: process.env.NODE_ENV,
      node: process.versions.node,
      fecha: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
