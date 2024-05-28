window.addEventListener('DOMContentLoaded', (event) => {
    let editingProductId = null; // Variável para armazenar o ID do produto sendo editado
    let productsData = []; // Armazena os dados dos produtos
    let orderItems = []; // Armazena os itens do pedido
    let orderTotal = 0; // Armazena o valor total do pedido

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

    // Função para adicionar produto ao pedido
    function addProductToOrder() {
        const productId = document.getElementById('productSelect').value;
        const product = productsData.find(p => p.id == productId);
        const quantity = parseInt(document.getElementById('quantity').value);
        const unitPrice = parseFloat(document.getElementById('unitPrice').value);

        if (product && quantity > 0 && unitPrice > 0) {
            const orderItem = {
                id: productId,
                nome: product.nome,
                quantidade: quantity,
                preco: unitPrice,
                total: quantity * unitPrice
            };

            orderItems.push(orderItem);
            orderTotal += orderItem.total;
            displayOrderSummary();
        } else {
            alert('Por favor, selecione um produto e informe a quantidade.');
        }
    }

    // Função para exibir resumo do pedido
    function displayOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        orderSummary.innerHTML = '';

        orderItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = `${item.nome} - Quantidade: ${item.quantidade} - Total: R$ ${item.total.toFixed(2)}`;
            orderSummary.appendChild(itemDiv);
        });

        const totalDiv = document.createElement('div');
        totalDiv.style.fontWeight = 'bold';
        totalDiv.textContent = `Valor Total do Pedido: R$ ${orderTotal.toFixed(2)}`;
        orderSummary.appendChild(totalDiv);
    }

    // Função para atualizar a quantidade de produtos na API
    function updateProductQuantities() {
        orderItems.forEach(item => {
            const product = productsData.find(p => p.id == item.id);
            if (product) {
                const newQuantity = product.quantidade - item.quantidade;
                fetch(`https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantidade: newQuantity })
                })
                .then(response => response.json())
                .then(updatedProduct => {
                    console.log(`Quantidade atualizada para o produto ${updatedProduct.nome}: ${updatedProduct.quantidade}`);
                    // Atualiza a quantidade no productsData para refletir a mudança imediatamente
                    product.quantidade = updatedProduct.quantidade;
                })
                .catch(error => console.error('Erro ao atualizar a quantidade do produto:', error));
            }
        });
    }

    // Função para enviar o pedido para a API
    function sendOrder() {
        const date = new Date();
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        const orderData = {
            produtos: orderItems.map(item => ({
                id: item.id,
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            data: formattedDate,
            valor: orderTotal
        };

        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(() => {
            alert('Pedido enviado com sucesso!');
            updateProductQuantities(); // Atualiza as quantidades dos produtos na API
            orderItems = []; // Limpa os itens do pedido
            orderTotal = 0; // Reseta o valor total do pedido
            displayOrderSummary(); // Atualiza a exibição do resumo do pedido
            loadOrders(); // Recarrega os pedidos
        })
        .catch(error => console.error('Erro ao enviar pedido:', error));
    }

    // Função para carregar pedidos da API
    function loadOrders() {
        fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/pedido')
            .then(response => response.json())
            .then(orders => {
                displayOrders(orders);
            })
            .catch(error => console.error('Erro ao carregar pedidos:', error));
    }

    // Função para exibir pedidos na tabela
    function displayOrders(orders) {
        const ordersTableBody = document.getElementById('ordersTableBody');
        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.data}</td>
                <td>R$ ${order.valor.toFixed(2)}</td>
                <td>${order.produtos.map(p => p.nome).join(', ')}</td>
            `;
            ordersTableBody.appendChild(row);
        });
    }

    // Event listeners para os botões
    document.getElementById('finalizeOrder').addEventListener('click', addProductToOrder);
    document.getElementById('sendOrder').addEventListener('click', sendOrder);

    // Carregar produtos e pedidos ao iniciar a página
    loadProducts();
    loadOrders();
});
