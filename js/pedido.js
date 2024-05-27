window.addEventListener('DOMContentLoaded', (event) => {
    let productsData = []; // Armazena os dados dos produtos

    // Função para carregar produtos da API
    function loadProducts() {
        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto')
            .then(response => response.json())
            .then(products => {
                productsData = products; // Armazena os dados dos produtos
                populateProductSelect(products);
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    // Função para preencher o select de produtos
    function populateProductSelect(products) {
        const productSelect = document.getElementById('productSelect');
        if (!productSelect) {
            console.error('Elemento select não encontrado!');
            return;
        }
        productSelect.innerHTML = '<option value="">Selecione um produto</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.nome;
            productSelect.appendChild(option);
        });
    }

    // Evento para atualizar o preço unitário ao selecionar um produto
    const productSelectElement = document.getElementById('productSelect');
    if (productSelectElement) {
        productSelectElement.addEventListener('change', function() {
            const selectedProductId = this.value;
            if (selectedProductId) {
                const selectedProduct = productsData.find(product => product.id == selectedProductId);
                if (selectedProduct) {
                    document.getElementById('unitPrice').value = selectedProduct.precoUnitario;
                }
            } else {
                document.getElementById('unitPrice').value = '';
            }
        });
    } else {
        console.error('Elemento select não encontrado para adicionar o event listener!');
    }

    // Carrega os produtos ao iniciar a página
    loadProducts();
});
