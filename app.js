const readExcel = require("read-excel-file/node");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
require("dotenv").config();

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("loading_screen", (percent, message) => {
    console.log("LOADING SCREEN", percent, message);
});

client.on("authenticated", () => {
    console.log("AUTHENTICATED");
});

client.on("ready", () => {
    console.log("Client is ready!");

    let success = 0;
    let failed = 0;

    readExcel("./public/" + process.env.BLAST_FILE_NAME).then(async (data) => {
        data.shift();

        await Promise.all(
            data.map(async (item, i) => {
                const name = item[1];
                const phone = item[3];

                if (phone) {
                    // change to local phone number
                    const convertedPhone = phone
                        .replace(/-/g, "")
                        .replace("0", "62");
                    const options = {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    };
                    const currentDate = new Date().toLocaleDateString(
                        "id-ID",
                        options
                    );

                    const msg =
                        "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nKepada Yth, Bapak/Ibu " +
                        name +
                        "\n\nTabe', dengan penuh kerendahan hati kami sampaikan, bahwa jadwal Bapak/Ibu untuk membawa hidangan buka puasa ke Mesjid Al Muraaqabah telah tiba.\n\nTanggal:\n" +
                        currentDate +
                        "\n\nWaktu:\nSetelah sholat ashar - menjelang maghrib\n\nTempat Penyaluran:\nPintu Utama Masjid\n\nAtas partisipasi Bapak/Ibu dalam hal tersebut, Kami pengurus/panitia masjid mengucapkan Jazakumullah Khairan Katsiran, semoga amal ibadah kita diterima disisi Allah subhanahu wa ta'ala, aamiin ya rabbal 'alamin\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh\n*_Badan Eksekutif Mesjid Al-Muraaqabah_*";
                    const chatId = convertedPhone + "@c.us";

                    const timeout = i * 5000;

                    await new Promise((resolve) =>
                        setTimeout(() => {
                            try {
                                client.sendMessage(chatId, msg);
                                console.log(`Message Sent to Client ${name}`);
                                success++;
                            } catch (err) {
                                console.log(err);
                                console.log(
                                    `Message Failed Sent to Client ${name}`
                                );
                                failed++;
                            }

                            resolve();
                        }, timeout)
                    );
                }
            })
        );

        console.log(`${success} success\n${failed} failed`);
    });
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.initialize();
