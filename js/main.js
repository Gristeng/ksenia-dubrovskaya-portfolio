window.addEventListener("scroll", function(){

    const header = document.querySelector(".header");

    if(window.scrollY > 50){

        header.style.background = "rgba(10,10,10,.92)";
        header.style.backdropFilter = "blur(12px)";
        header.style.transition = ".35s";

    }else{

        header.style.background = "transparent";
        header.style.backdropFilter = "none";

    }

});
const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    zoomable: true,
    openEffect: 'zoom',
    closeEffect: 'fade'
});
AOS.init({
    duration: 1200,
    once: true,
    easing: 'ease-out-cubic',
    offset: 100
});
// ==========================
// BOOKING FORM
// ==========================

const bookingForm = document.getElementById("bookingForm");
const successMessage = document.getElementById("successMessage");

if (bookingForm) {

    bookingForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (name === "" || phone === "") {

            alert("Пожалуйста, заполните обязательные поля.");

            return;

        }

        bookingForm.reset();

        successMessage.style.display = "block";

        setTimeout(() => {

            successMessage.style.display = "none";

        }, 5000);

    });

}