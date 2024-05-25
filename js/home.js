window.addEventListener('DOMContentLoaded', (event) => {
    let editingProductId = null; // Variável para armazenar o ID do produto sendo editado

    // Função para extrair parâmetros da URL
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(param => {
            const [key, value] = param.split("=");
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    const params = getQueryParams();
    const username = params.username || 'Admin';
    document.getElementById('username').textContent = username;
    
    // Modal functionality
    const modal = document.getElementById('addProductModal');
    const addProductLink = document.getElementById('addProductLink');
    const closeButton = document.querySelector('.close-button');
    const addProductForm = document.getElementById('addProductForm');

    addProductLink.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'block';
        editingProductId = null; // Reseta o ID do produto sendo editado
        addProductForm.reset(); // Limpa o formulário
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (editingProductId) {
            updateProduct(editingProductId); // Atualiza o produto existente
        } else {
            addProduct(); // Adiciona um novo produto
        }
    });

    // Função para carregar produtos da API
    function loadProducts() {
        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto')
            .then(response => response.json())
            .then(products => {
                displayProducts(products);
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    // Função para exibir produtos na tabela
    function displayProducts(products) {
        const tbody = document.querySelector('#productTable tbody');
        tbody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.nome}</td>
                <td>${product.quantidade}</td>
                <td>${product.categoria}</td>
                <td>
                    <button class="edit-button" onclick="editProduct(${product.id})">Editar</button>
                    <button class="delete-button" onclick="deleteProduct(${product.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Função para adicionar produto
    function addProduct() {
        const nome = document.getElementById('productName').value;
        const quantidade = document.getElementById('productQuantity').value;
        const categoria = document.getElementById('productCategory').value;

        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                quantidade,
                categoria
            })
        })
        .then(response => response.json())
        .then(() => {
            modal.style.display = 'none';
            loadProducts();
        })
        .catch(error => console.error('Erro ao adicionar produto:', error));
    }

    // Função para atualizar produto
    function updateProduct(id) {
        const nome = document.getElementById('productName').value;
        const quantidade = document.getElementById('productQuantity').value;
        const categoria = document.getElementById('productCategory').value;

        fetch(`https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                quantidade,
                categoria
            })
        })
        .then(response => response.json())
        .then(() => {
            modal.style.display = 'none';
            loadProducts();
        })
        .catch(error => console.error('Erro ao atualizar produto:', error));
    }

    // Função para editar produto
    window.editProduct = function(id) {
        fetch(`https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto/${id}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('productName').value = product.nome;
                document.getElementById('productQuantity').value = product.quantidade;
                document.getElementById('productCategory').value = product.categoria;
                editingProductId = id;
                modal.style.display = 'block';
            })
            .catch(error => console.error('Erro ao carregar produto:', error));
    }

    // Função para excluir produto
    window.deleteProduct = function(id) {
        fetch(`https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadProducts();
        })
        .catch(error => console.error('Erro ao excluir produto:', error));
    }

    // Função de pesquisa de produtos
    function searchProducts() {
        const searchValue = document.getElementById('searchBar').value.toLowerCase();
        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto')
            .then(response => response.json())
            .then(products => {
                const filteredProducts = products.filter(product => product.nome.toLowerCase().includes(searchValue));
                displayProducts(filteredProducts);
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    // Evento de input para a barra de pesquisa
    document.getElementById('searchBar').addEventListener('input', searchProducts);

    // Carrega produtos ao iniciar a página
    loadProducts();
});
