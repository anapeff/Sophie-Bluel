document.addEventListener('DOMContentLoaded', function () {
    let modal = null;
    let modal2 = null;
   

    const openModal = function (e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        let target = document.querySelector(href);
        if (target) {
            target.classList.remove('hidden');
            target.removeAttribute('aria-hidden');
            target.setAttribute('aria-modal', 'true');
            modal = target;
            modal.addEventListener('click', closeModal);
            modal.querySelector('.close').addEventListener('click', closeModal);
            modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
          
        }
    };
    const openModal2 = function (e) {
        e.preventDefault();
        modal = document.querySelector('.modal');
        modal2 = document.querySelector('.modal2');
        if (modal) {
            modal.classList.add('hidden');
        }
        if (modal2) {
            modal2.classList.remove('hidden');
            modal2.classList.add('hidden');
            modal2.setAttribute('aria-hidden', 'true');
            modal2.removeAttribute('aria-modal');
            modal2.removeEventListener('click', closeModal);
            const closeButton = modal.querySelector('.close');
            if (closeButton) {
                closeButton.removeEventListener('click', closeModal);
            }
            modal = null;
        }
    
        modal2 = document.querySelector('.modal2');
        if (modal2) {
            modal2.classList.remove('hidden');
            modal2.removeAttribute('aria-hidden');
            modal2.setAttribute('aria-modal', 'true');
            modal2.addEventListener('click', stopPropagation);
            modal2.querySelector('.close').addEventListener('click', closeModal);
        }
    };

    const closeModal = function (e) {
        if (modal === null && modal2 === null) return;
        e.preventDefault();
    
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            modal.removeEventListener('click', closeModal);
            const closeButton = modal.querySelector('.close');
            if (closeButton) {
                closeButton.removeEventListener('click', closeModal);
            }
            modal = null;
        }
        
        if (modal2) {
            modal2.classList.add('hidden');
            modal2.setAttribute('aria-hidden', 'true');
            modal2.removeAttribute('aria-modal');
            modal2.removeEventListener('click', closeModal);
            const closeButton = modal2.querySelector('.close');
            if (closeButton) {
                closeButton.removeEventListener('click', closeModal);
            }
            modal2 = null;
        }
    };
    

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    document.querySelectorAll('.button-modal-1').forEach(btn => {
        btn.addEventListener('click', openModal2);
    });

    const stopPropagation = function (e) {
        e.stopPropagation();
    };

   
});

