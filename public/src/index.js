
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Получение карт из базы данных
    if (url.pathname === "/api/cards" && request.method === "GET") {
      try {
        const { results } = await env.DB
          .prepare(`
            SELECT id, name, title, image, prediction
            FROM cards
            WHERE active = 1
            ORDER BY id
          `)
          .all();

        return Response.json(results, {
          headers: {
            "Cache-Control": "no-store"
          }
        });

      } catch (error) {
        return Response.json(
          {
            error: "Не удалось загрузить карты",
            details: error.message
          },
          { status: 500 }
        );
      }
    }

    // Все остальные запросы передаём статическим файлам
    return env.ASSETS.fetch(request);
  }
};
