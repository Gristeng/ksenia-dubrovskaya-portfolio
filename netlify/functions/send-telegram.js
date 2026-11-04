
const allowedOrigins = [
    "https://gristeng.github.io",
    "https://brilliant-ganache-2c83d3.netlify.app"
];

export default async (request) => {
    const origin = request.headers.get("Origin");

    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
            ? origin
            : "",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin"
    };

    const jsonHeaders = {
        ...corsHeaders,
        "Content-Type": "application/json"
    };

    if (origin && !allowedOrigins.includes(origin)) {
        return new Response(
            JSON.stringify({ success: false, error: "Origin not allowed" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
        );
    }

    // Обработка предварительного CORS-запроса браузера
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders
        });
    }

    if (request.method !== "POST") {
        return new Response(
            JSON.stringify({ success: false, error: "Method Not Allowed" }),
            { status: 405, headers: jsonHeaders }
        );
    }

    try {
        const data = await request.json();

        const {
            name,
            phone,
            email,
            date,
            service,
            message
        } = data;

        const text = `
📸 НОВАЯ ЗАЯВКА С САЙТА

👤 Имя: ${name}

📱 Телефон / Telegram: ${phone}

📧 E-mail: ${email || "Не указан"}

📅 Желаемая дата: ${date || "Не указана"}

📷 Услуга: ${service || "Не выбрана"}

💬 Сообщение:
${message || "Нет сообщения"}
        `;

        const telegramUrl =
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: text
            })
        });

        const telegramResult = await telegramResponse.json();

        if (!telegramResponse.ok || !telegramResult.ok) {
            throw new Error(
                `Telegram: ${telegramResult.description || "Неизвестная ошибка"}`
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: jsonHeaders
            }
        );

    } catch (error) {
        console.error("TELEGRAM ERROR:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || "Ошибка сервера"
            }),
            {
                status: 500,
                headers: jsonHeaders
            }
        );
    }
};
