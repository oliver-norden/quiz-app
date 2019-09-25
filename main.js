document.addEventListener('DOMContentLoaded', () => {
    let hello = document.createElement('p');
    hello.textContent = 'Hello world';
    document.getElementById('root').appendChild(hello);
});