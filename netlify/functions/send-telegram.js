export default async (request) => {

    // Разрешаем запросы с сайта
    if (request.method !== "POST") {
        return new Response(
            JSON.stringify({
                error: "Method Not Allowed"
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
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


        const telegramResponse = await fetch(
            telegramUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: text
                })
            }
        );


        const telegramResult = await telegramResponse.json();

if (!telegramResponse.ok || !telegramResult.ok) {

    throw new Error(
        `Telegram: ${telegramResult.description || "Неизвестная ошибка"}`
    );

}


        return new Response(
            JSON.stringify({
                success: true
            }),
            {
                status: 200,

                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {

        console.error(error);

        return new Response(
            JSON.stringify({
                success: false,
                error: "Ошибка сервера"
            }),
            {
                status: 500,

                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

};