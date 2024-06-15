document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products');
    const productsContainer2 = document.getElementById('products2');
    const categoryCountsContainer = document.getElementById('category-counts');
    const actionSelect = document.getElementById("actionSelect");

    let editingProductId = null; // Variável para armazenar o ID do produto sendo editado

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
                checkLowStock(products); // Verifica o estoque baixo
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
                <td>${product.unidade}</td>
                <td>${product.precoUnitario}</td>
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
        const unidade = document.getElementById('quantityUnit').value;
        const precoUnitario = document.getElementById('precoUnitario').value;

        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                quantidade,
                unidade,
                precoUnitario,
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
        const precoUnitario = document.getElementById('precoUnitario').value;
        const unidade = document.getElementById('quantityUnit').value;

        fetch(`https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                quantidade,
                unidade,
                precoUnitario,
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
                document.getElementById('precoUnitario').value = product.precoUnitario;
                document.getElementById('quantityUnit').value = product.unidade;
                
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

    // Função para exportar os dados para CSV
    function exportTableToCsv() {
        const rows = [];
        const table = document.querySelector("#productTable");
        const headers = Array.from(table.querySelectorAll("th"))
                             .filter(header => header.textContent !== "Ações")
                             .map(header => header.textContent);
        rows.push(headers);

        table.querySelectorAll("tbody tr").forEach(row => {
            const rowData = [];
            Array.from(row.querySelectorAll("td")).forEach((cell, index) => {
                if (index < headers.length) {
                    rowData.push(cell.textContent);
                }
            });
            rows.push(rowData);
        });

        exportToCsv("data.csv", rows);
    }

    // Função para exportar os dados para CSV
    function exportToCsv(filename, rows) {
        const csvContent = "data:text/csv;charset=utf-8," 
                         + rows.map(row => row.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Função para verificar estoque baixo e exibir aviso
    function checkLowStock(products) {
        const lowStockProducts = products.filter(product => product.quantidade < 5);
        if (lowStockProducts.length > 0) {
            const lowStockMessage = lowStockProducts.map(product => `${product.nome}`).join(', ');
            document.getElementById('lowStockMessage').textContent = `Estoque baixo: ${lowStockMessage}`;
            document.getElementById('lowStockAlert').style.display = 'block';
        }
    }

    // Evento para fechar o alerta de estoque baixo
    document.getElementById('closeAlertButton').addEventListener('click', function() {
        document.getElementById('lowStockAlert').style.display = 'none';
    });

    // Event listener para o select de ações
    actionSelect.addEventListener("change", function() {
        const selectedAction = this.value;
        if (selectedAction === "exportCsv") {
            exportTableToCsv();
            actionSelect.value = ""; // Reset the select after action
        }
    });

    const typebotInitScript = document.createElement("script");
typebotInitScript.type = "module";
typebotInitScript.innerHTML = `import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.2/dist/web.js'

Typebot.initBubble({
  typebot: "my-typebot-0lij7sp",
  theme: { placement: "right", button: { backgroundColor: "#0042DA" } },
});
`;
document.body.append(typebotInitScript);

    // Evento de input para a barra de pesquisa
    document.getElementById('searchBar').addEventListener('input', searchProducts);
    
    // Carrega produtos ao iniciar a página
    loadProducts();
});
