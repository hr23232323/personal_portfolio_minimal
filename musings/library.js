const spines = [...document.querySelectorAll('.book-spine')];
const volume = document.querySelector('#book-volume');
const book = document.querySelector('#featured-book');
const link = document.querySelector('#featured-link');
const image = document.querySelector('#featured-image');
const issue = document.querySelector('#featured-issue');
const title = document.querySelector('#featured-title');
const heading = document.querySelector('#featured-heading');
const deck = document.querySelector('#featured-deck');
const date = document.querySelector('#featured-date');
const time = document.querySelector('#featured-time');

function preview(spine) {
    if (spine.classList.contains('is-active')) return;
    spines.forEach((item) => item.classList.toggle('is-active', item === spine));
    volume.classList.add('is-changing');
    window.setTimeout(() => {
        book.href = spine.href;
        book.setAttribute('aria-label', `Read ${spine.dataset.title}`);
        link.href = spine.href;
        image.src = spine.dataset.image;
        issue.textContent = spine.dataset.issue;
        title.innerHTML = spine.dataset.display;
        heading.textContent = spine.dataset.title;
        deck.textContent = spine.dataset.deck;
        date.textContent = spine.dataset.date;
        time.textContent = spine.dataset.time;
        volume.classList.remove('is-changing');
    }, 150);
}

spines.forEach((spine) => {
    spine.addEventListener('pointerenter', () => preview(spine));
    spine.addEventListener('focus', () => preview(spine));
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    book.addEventListener('pointermove', (event) => {
        const bounds = book.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        volume.style.transform = `rotateY(${x * 8 - 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
    });
    book.addEventListener('pointerleave', () => volume.style.removeProperty('transform'));
}
