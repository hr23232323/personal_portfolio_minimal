const backLink = document.querySelector('.topbar__back');

if (backLink) {
    let previousUrl;

    try {
        previousUrl = document.referrer ? new URL(document.referrer) : null;
    } catch {
        previousUrl = null;
    }

    const cameFromThisSite = previousUrl?.origin === window.location.origin;
    const previousPath = cameFromThisSite ? previousUrl.pathname : '';

    if (previousPath === '/') {
        backLink.href = '/#writing';
        backLink.textContent = '← Home';
    } else if (previousPath === '/musings/' || previousPath.startsWith('/musings/index.')) {
        backLink.href = '/musings/';
        backLink.textContent = '← Musings';
    } else if (cameFromThisSite && previousPath !== window.location.pathname) {
        backLink.href = `${previousUrl.pathname}${previousUrl.search}${previousUrl.hash}`;
        backLink.textContent = '← Back';
    }

    if (cameFromThisSite && previousPath !== window.location.pathname) {
        backLink.addEventListener('click', (event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            window.history.back();
        });
    }
}
