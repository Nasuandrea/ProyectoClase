fetch('api/get_users.php')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('cards-container');
        data.forEach(user => {
            container.innerHTML += `
                <div class="card">
                    <img src="avatars/${user.avatar2D}" alt="avatar">
                    <h3>${user.nombre}</h3>
                    <p>${user.descripcion}</p>
                    <small>${user.ciudad} · ${user.modalidad}</small>
                </div>
            `;
        });
    });