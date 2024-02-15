document.addEventListener('DOMContentLoaded', function () {
    let modal1 = document.querySelector('#modal1');
    let modal2 = document.querySelector('.modal2');

    const openModal1 = function () {
        modal1.classList.remove('hidden');
        modal1.setAttribute('aria-hidden', 'false');
        modal1.setAttribute('aria-modal', 'true');
        modal1.addEventListener('click', stopPropagation);
        modal1.querySelector('.close').addEventListener('click', closeModal1);
    };

    const openModal2 = function () {
        modal2.classList.remove('hidden');
        modal2.setAttribute('aria-hidden', 'false');
        modal2.setAttribute('aria-modal', 'true');
        modal2.addEventListener('click', stopPropagation);
        modal2.querySelector('.close').addEventListener('click', closeModal2);
        modal1.classList.add('hidden'); // Cacher la modal1
    };

    const closeModal1 = function () {
        modal1.classList.add('hidden');
        modal1.setAttribute('aria-hidden', 'true');
        modal1.removeAttribute('aria-modal');
        modal1.removeEventListener('click', stopPropagation);
        modal1.querySelector('.close').removeEventListener('click', closeModal1);
    };

    const closeModal2 = function () {
        modal2.classList.add('hidden');
        modal2.setAttribute('aria-hidden', 'true');
        modal2.removeAttribute('aria-modal');
        modal2.removeEventListener('click', stopPropagation);
        modal2.querySelector('.close').removeEventListener('click', closeModal2);
    };

    const stopPropagation = function (e) {
        e.stopPropagation();
    };

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal1);
    });

    document.querySelectorAll('.button-modal-1').forEach(btn => {
        btn.addEventListener('click', openModal2);
    });

    // Gestionnaire d'événements pour la flèche retour sur la modal2
    const arrowLeft = document.querySelector('.arrow-left');
    arrowLeft.addEventListener('click', function() {
        closeModal2(); 
        openModal1(); 
    });
});
