const transitionBooks = [...document.querySelectorAll('.stack-book')];

transitionBooks.forEach((book) => {
    book.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        transitionBooks.forEach((item) => {
            item.style.viewTransitionName = 'none';
        });
        book.style.viewTransitionName = 'featured-book';

        // Make the selected book the shared element before navigation captures the page.
        book.getBoundingClientRect();
    });
});
