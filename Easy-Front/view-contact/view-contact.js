const apiUrl = 'http://localhost:8080/api';
const deleteUrl = 'http://localhost:8080/api/dell';

function reloadPage() {
  location.reload();
}

function fetchContacts() {
  console.log('Carregando dados...');
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Dados recebidos:', data);
      const listContainer = document.querySelector('.list-container');
      listContainer.innerHTML = '';

      document.getElementById('total-contacts').textContent = data.length;
      const contactsWith11 = data.filter(item => item.numero.includes('11')).length;
      document.getElementById('contacts-with-11').textContent = contactsWith11;

      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          const listItem = document.createElement('div');
          listItem.classList.add('list-item');

          listItem.innerHTML = `
            <img src="${item.link}" alt="Foto de ${item.nome}" class="profile-pic">
            <div class="contact-details">
              <h3>${item.nome}</h3>
              <p>${item.numero}</p>
              <p>${item.descricao}</p>
            </div>
            <div class="btn-container">
              <button class="btn btn-edit" onclick="editData('${item.id}')">Editar</button>
              <button class="btn btn-delete" onclick="deleteData('${item.id}')">Excluir</button>
            </div>
          `;

          listContainer.appendChild(listItem);
        });
      } else {
        listContainer.innerHTML = '<p>Nenhum dado encontrado.</p>';
      }
    })
    .catch(error => {
      console.error('Erro ao carregar dados:', error);
    });
}

function editData(id) {
  const modal = document.getElementById('editModal');
  modal.style.display = 'block';

  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editNome').value = data.nome;
      document.getElementById('editNumero').value = data.numero;
      document.getElementById('editDescricao').value = data.descricao;
      document.getElementById('editLink').value = data.link;

      document.getElementById('editData').onclick = function () {
        const updatedData = {
          nome: document.getElementById('editNome').value,
          numero: document.getElementById('editNumero').value,
          descricao: document.getElementById('editDescricao').value,
          link: document.getElementById('editLink').value,
        };

        fetch(`${apiUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro ao editar dados: ${response.status}`);
            }
            return response.json();
          })
          .then(() => {
            alert('Dados editados com sucesso!');
            closeModal();
            fetchContacts();
          })
          .catch(error => {
            console.error('Erro ao editar dados:', error);
            alert(`Erro: ${error.message}`);
          });
      };
    })
    .catch(error => {
      console.error('Erro ao carregar dados para edição:', error);
      alert(`Erro: ${error.message}`);
    });
}

function closeModal() {
  const modal = document.getElementById('editModal');
  modal.style.display = 'none';
}

function deleteData(id) {
  const confirmDelete = confirm('Tem certeza que deseja excluir este contato?');
  if (confirmDelete) {
    fetch(`${deleteUrl}/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao excluir dados: ${response.status}`);
        }
        alert('Contato excluído com sucesso!');
        fetchContacts();
      })
      .catch(error => {
        console.error('Erro ao excluir dados:', error);
        alert(`Erro: ${error.message}`);
      });
  }
}

window.onload = fetchContacts;
