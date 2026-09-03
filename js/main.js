/* =========================================
   HEADER
========================================= */

window.addEventListener("scroll", function () {

    const header = document.querySelector(".header");

    if (!header) return;

    if (window.scrollY > 50) {

        header.style.background = "rgba(10,10,10,.92)";
        header.style.backdropFilter = "blur(12px)";
        header.style.transition = ".35s";

    } else {

        header.style.background = "transparent";
        header.style.backdropFilter = "none";

    }

});


/* =========================================
   AOS ANIMATIONS
========================================= */

if (typeof AOS !== "undefined") {

    AOS.init({

        duration: 1200,

        once: true,

        easing: "ease-out-cubic",

        offset: 100

    });

}


/* =========================================
   BOOKING FORM
========================================= */

const bookingForm = document.getElementById("bookingForm");

const successMessage =
    document.getElementById("successMessage");


if (bookingForm) {

    bookingForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const email =
            document.getElementById("email")?.value.trim() || "";

        const date =
            document.getElementById("date")?.value.trim() || "";

        const service =
            document.getElementById("service")?.value.trim() || "";

        const message =
            document.getElementById("message")?.value.trim() || "";


        if (name === "" || phone === "") {

            alert(
                "Пожалуйста, заполните обязательные поля."
            );

            return;

        }


        const submitButton =
            bookingForm.querySelector("button[type='submit']");


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Отправка...";

        }


        try {

            const response = await fetch(
                "/.netlify/functions/send-telegram",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        email: email,

                        date: date,

                        service: service,

                        message: message

                    })

                }
            );


            const result =
                await response.json();


            if (!response.ok || !result.success) {

                throw new Error(
                    "Не удалось отправить заявку"
                );

            }


            bookingForm.reset();


            if (successMessage) {

                successMessage.style.display =
                    "block";


                setTimeout(function () {

                    successMessage.style.display =
                        "none";

                }, 5000);

            }


        } catch (error) {

            console.error(error);

            alert(
                "Не удалось отправить заявку. Попробуйте ещё раз."
            );


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Отправить заявку";

            }

        }

    });

}