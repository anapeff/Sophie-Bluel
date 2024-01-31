let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    console.log('mon lien fait quelque chose', href);
    let target = document.querySelector(href);
    if (target) {
        console.log('Sélec elem ', target);
        target.classList.remove('hidden'); // Supprime la classe hidden
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
        modal = target;
        modal.addEventListener('click', closeModal);
        modal.querySelector('.close').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    }
}

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();

    modal.classList.add('hidden'); // Ajoute la classe hidden
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    modal = null;
};

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

const stopPropagation = function (e){
    e.stopPropagation()
}