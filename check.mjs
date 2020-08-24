import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

fs.readdir(path.join(__dirname), async (error, files) => {

    if (error) {
        return console.log("[!] Ошибка при получении файлов из папки со скриптом. Проверить наличие конфига не удастся.");
    }

    if (files.includes("config.json")) {
        try {
            const config = await import("./config");

            if (config.default.version_dont_modify_me !== 1) {
                rename();

                createConfig();

                console.log("[!] Версия конфига не соответствует текущей, файл был переименован в config_old.json. Новый файл с конфигом был создан, настройте его следуя инструкции.");

                process.exit(-1);
            }
        } catch {
            rename();

            createConfig();

            console.log("[!] Конфиг поврежден либо настроен неправильно, файл был переименован в config_old.json. Новый файл с конфигом был создан, настройте его следуя инструкции.");

            process.exit(-1);
        }
    } else {
        createConfig();

        console.log("[!] Конфиг в папке со скриптом не обнаружен, создан новый файл с конфигом. Настройте его следуя инструкции.");

        process.exit(-1);
    }

    if (files.includes("news.json")) {
        try {
            await import("./news");
        } catch {
            createNews();
        }
    } else {
        createNews();
    }
});

function createConfig() {
    const config = {
        clusters: [
            {
                vk: {
                    token: "Токен от вашей страницы или группы ВКонтакте",
                    group_id: "club(id) или специальная ссылка, например bolotoboli",
                    keywords: [],
                    filter: true,
                    longpoll: false,
                    interval: 30
                },
                discord: {
                    webhook_urls: [
                        "ссылка на вебхук"
                    ],
                    bot_name: "VK2DISCORD",
                    color: "#aabbcc"
                }
            }
        ],
        version_dont_modify_me: 1
    };

    fs.writeFileSync("./config.json", JSON.stringify(config, null, "\t"));
}

function rename() {
    fs.renameSync("./config.json", "./config_old.json");
}

function createNews() {
    fs.writeFileSync("./news.json", JSON.stringify({}, null, "\t"));
}
