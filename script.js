function publishPost() {
    const postText = document.getElementById('postText').value;
    const mediaInput = document.getElementById('mediaInput');
    const files = mediaInput.files;
    const mediaFiles = [];

    // Чтение медиафайлов
    for (const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            mediaFiles.push(reader.result);
            if (mediaFiles.length === files.length) {
                const newPost = {
                    text: postText,
                    media: mediaFiles,
                    timestamp: new Date().toISOString()
                };
                addPostToHTML(newPost);
                savePost(newPost);
            }
        };
    }

    // Если нет медиафайлов
    if (files.length === 0) {
        const newPost = {
            text: postText,
            media: [],
            timestamp: new Date().toISOString()
        };
        addPostToHTML(newPost);
        savePost(newPost);
    }

    document.getElementById('postText').value = '';
    mediaInput.value = '';
}

function addPostToHTML(post) {
    const postsContainer = document.getElementById('postsContainer');
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `<p>${post.text}</p><p>${post.timestamp}</p>`;
    post.media.forEach(mediaSrc => {
        const mediaElement = document.createElement('img');
        mediaElement.src = mediaSrc;
        mediaElement.className = 'media';
        postElement.appendChild(mediaElement);
    });
    postsContainer.insertBefore(postElement, postsContainer.firstChild);

    // Обновление HTML-кода
    updateHTMLCode();
}

function savePost(post) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => addPostToHTML(post));
}

function updateHTMLCode() {
    const container = document.querySelector('.container');
    const htmlCode = container.innerHTML;
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Скачивание обновленного HTML-кода
    const a = document.createElement('a');
    a.href = url;
    a.download = 'home.html';
    a.click();
}

// Загрузка постов при загрузке страницы
document.addEventListener('DOMContentLoaded', loadPosts);
