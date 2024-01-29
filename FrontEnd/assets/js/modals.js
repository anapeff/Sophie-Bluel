
let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close').addEventListener('click', closeModal);
    modal.addEventListener('click', closeModal);
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();

    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close').removeEventListener('click', closeModal);
 
    modal = null;
};



document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal) ;
     
    })
    

