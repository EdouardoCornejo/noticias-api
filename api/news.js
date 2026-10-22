/* Proxy hacia NewsAPI: la API key solo vive en el servidor. */
const CATEGORIAS = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

/* NewsAPI ya no devuelve titulares para "mx"; se usa un país con resultados. */
const PAIS = "us";

/* NewsAPI (plan gratuito) solo permite consultar los primeros 100 resultados. */
const MAX_PAGINA = 5;

export async function GET(request) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return Response.json({ message: "NEWS_API_KEY no configurada" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("category") ?? "general";
  const pagina = Number(searchParams.get("page") ?? 1);

  if (!CATEGORIAS.includes(categoria)) {
    return Response.json({ message: "Categoría no válida" }, { status: 400 });
  }
  if (!Number.isInteger(pagina) || pagina < 1 || pagina > MAX_PAGINA) {
    return Response.json({ message: "Página no válida" }, { status: 400 });
  }

  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.search = new URLSearchParams({
    country: PAIS,
    category: categoria,
    page: String(pagina),
  });

  const respuesta = await fetch(url, {
    headers: { "X-Api-Key": apiKey, "User-Agent": "noticias-api" },
  });
  const data = await respuesta.json();

  if (!respuesta.ok) {
    return Response.json(
      { message: data.message ?? "Error al consultar NewsAPI" },
      { status: respuesta.status }
    );
  }

  return Response.json(
    { totalResults: data.totalResults, articles: data.articles },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
