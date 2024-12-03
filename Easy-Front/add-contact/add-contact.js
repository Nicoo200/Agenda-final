const apiUrl = 'http://localhost:8080/api';
const editUrl = 'http://localhost:8080/api';
const postUrl = 'http://localhost:8080/api/new';


function sendData(nome, numero, descricao, link) {
  const newData = { nome, numero, descricao, link };
  return fetch(postUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
  });
}

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function editData(id) {
  document.getElementById('editForm').style.display = 'block';

  fetch(`${apiUrl}/${id}`)
      .then(response => response.json())
      .then(data => {
          document.getElementById('editNome').value = data.nome;
          document.getElementById('editNumero').value = data.numero;
          document.getElementById('editDescricao').value = data.descricao;
          document.getElementById('editLink').value = data.link;

          document.getElementById('editData').addEventListener('click', function () {
              const updatedData = {
                  nome: document.getElementById('editNome').value,
                  numero: document.getElementById('editNumero').value,
                  descricao: document.getElementById('editDescricao').value,
                  link: document.getElementById('editLink').value
              };

              fetch(`${editUrl}/${id}`, {
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
                  .then(data => {
                      alert('Dados editados com sucesso!');
                      document.getElementById('editForm').style.display = 'none';
                      fetchContacts();
                  })
                  .catch(error => {
                      console.error('Erro ao editar dados:', error);
                      alert(`Erro: ${error.message}`);
                  });
          });
      })
      .catch(error => {
          console.error('Erro ao carregar dados para edição:', error);
          alert(`Erro: ${error.message}`);
      });
}

document.getElementById('add-contact-form').addEventListener('submit', function (event) {
  event.preventDefault(); 

  const nome = document.getElementById('name').value;
  const numero = document.getElementById('phone').value;
  const descricao = document.getElementById('description').value;
  const link = document.getElementById('link').value;

  console.log('Tentando adicionar dados:', { nome, numero, descricao, link });

  if (!nome || !numero || !descricao || !link) {
      showNotification('Por favor, preencha todos os campos!', 'error');
      return;
  }

  if (!/\.(jpg|jpeg|png|gif)$/i.test(link)) {
      showNotification('Por favor, insira uma URL válida de imagem!', 'error');
      return;
  }

  sendData(nome, numero, descricao, link)
      .then(response => {
          console.log('Resposta do POST:', response);
          if (!response.ok) {
              throw new Error(`Erro ao adicionar dados: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Dados adicionados com sucesso:', data);
          showNotification('Dados adicionados com sucesso!', 'success');
          
          window.location.href = '/view-contact/view-contact.html';
      })
      .catch(error => {
          console.error('Erro ao adicionar dados:', error);
          showNotification(`Erro: ${error.message}`, 'error');
      });
});
