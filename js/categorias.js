document.addEventListener('DOMContentLoaded', function() {
    const productsContainerLowStock = document.getElementById('products');
    const productsContainerHighStock = document.getElementById('products2');
    const categoryCountsContainer = document.getElementById('category-counts');
    const categoryPopup = document.getElementById('categoryPopup');
    const closeButton = document.querySelector('.close-button');
    const categoryProductsTable = document.getElementById('categoryProductsTable');
    const salesSummaryTable = document.getElementById('salesSummaryTable');

    let lowStockProducts = [];
    let highStockProducts = [];
    let lowStockDisplayed = 10;
    let highStockDisplayed = 10;

    // Função para buscar os dados da API
    function fetchData(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os dados da API');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    // Função para criar e exibir a tabela de produtos
    function displayProductsTable(container, products, displayedCount) {
        container.innerHTML = '';
        const productsToShow = products.slice(0, displayedCount);

        if (productsToShow.length > 0) {
            const productsTable = document.createElement('table');
            productsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                        <th>Categoria</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsToShow.map(product => `
                        <tr>
                            <td>${product.nome}</td>
                            <td>${product.quantidade}</td>
                            <td>${product.unidade}</td>
                            <td>${product.categoria}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            container.appendChild(productsTable);

            if (products.length > displayedCount) {
                const loadMoreButton = document.createElement('button');
                loadMoreButton.textContent = 'Carregar mais';
                loadMoreButton.addEventListener('click', () => {
                    if (container === productsContainerLowStock) {
                        lowStockDisplayed += 10;
                        displayProductsTable(container, products, lowStockDisplayed);
                    } else {
                        highStockDisplayed += 10;
                        displayProductsTable(container, products, highStockDisplayed);
                    }
                });
                container.appendChild(loadMoreButton);
            }
        }
    }

    // Função para contar os produtos por categoria
    function countProductsByCategory(products) {
        const categoryCounts = {};

        products.forEach(product => {
            const category = product.categoria;
            if (categoryCounts[category]) {
                categoryCounts[category]++;
            } else {
                categoryCounts[category] = 1;
            }
        });

        return categoryCounts;
    }

    // Função para exibir a contagem de produtos por categoria
    function displayCategoryCounts(counts) {
        categoryCountsContainer.innerHTML = '';
        Object.entries(counts).forEach(([category, count]) => {
            const countElement = document.createElement('div');
            countElement.textContent = `${category}: ${count} produtos`;
            countElement.dataset.category = category;
            countElement.addEventListener('click', () => {
                displayCategoryProducts(category);
            });
            categoryCountsContainer.appendChild(countElement);
        });
    }

    // Função para exibir os produtos da categoria selecionada em um pop-up
    function displayCategoryProducts(category) {
        const filteredProducts = lowStockProducts.filter(product => product.categoria === category);
        categoryProductsTable.innerHTML = '';

        const productsTable = document.createElement('table');
        productsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                    <th>Categoria</th>
                </tr>
            </thead>
            <tbody>
                ${filteredProducts.map(product => `
                    <tr>
                        <td>${product.nome}</td>
                        <td>${product.quantidade}</td>
                        <td>${product.unidade}</td>
                        <td>${product.categoria}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        categoryProductsTable.appendChild(productsTable);

        categoryPopup.style.display = 'block';
    }

    // Event listener para fechar o pop-up
    closeButton.addEventListener('click', () => {
        categoryPopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === categoryPopup) {
            categoryPopup.style.display = 'none';
        }
    });

     // Função principal para buscar e exibir os dados de produtos com menor e maior quantidade em estoque
     async function displayProducts() {
        try {
            lowStockProducts = await fetchData('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto?sortBy=quantidade&order=asc');
            displayProductsTable(productsContainerLowStock, lowStockProducts, lowStockDisplayed);

            highStockProducts = await fetchData('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto?sortBy=quantidade&order=desc');
            displayProductsTable(productsContainerHighStock, highStockProducts, highStockDisplayed);

            // Use apenas os produtos de menor quantidade para a contagem
            const categoryCounts = countProductsByCategory(lowStockProducts);
            displayCategoryCounts(categoryCounts);
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
    }

    // Função para calcular o resumo de vendas por data
    function calculateSalesSummary(orders) {
        const salesSummary = {};

        orders.forEach(order => {
            const date = order.data; // Assumindo que a data está no formato "DD/MM/YYYY"
            if (!salesSummary[date]) {
                salesSummary[date] = 0;
            }
            salesSummary[date] += order.valor;
        });

        return salesSummary;
    }

    window.addEventListener('DOMContentLoaded', (event) => {
        // Função para carregar pedidos da API
        function loadOrders() {
            fetch('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/pedido')
                .then(response => response.json())
                .then(orders => {
                    const salesSummary = calculateSalesSummary(orders);
                    displaySalesSummary(salesSummary);
                })
                .catch(error => console.error('Erro ao carregar pedidos:', error));
        }
    
        // Função para calcular o resumo de vendas por data
        function calculateSalesSummary(orders) {
            const salesSummary = {};
    
            orders.forEach(order => {
                const date = order.data; // Assumindo que a data está no formato "DD/MM/YYYY"
                if (!salesSummary[date]) {
                    salesSummary[date] = 0;
                }
                salesSummary[date] += order.valor;
            });
    
            return salesSummary;
        }
    
        // Função para exibir o resumo de vendas na tabela
        function displaySalesSummary(salesSummary) {
            const salesSummaryTableBody = document.getElementById('salesSummaryTable').querySelector('tbody');
            salesSummaryTableBody.innerHTML = '';
    
            Object.entries(salesSummary).forEach(([date, totalValue]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${date}</td>
                    <td>R$ ${totalValue.toFixed(2)}</td>
                `;
                salesSummaryTableBody.appendChild(row);
            });
        }
    
        // Carregar pedidos ao iniciar a página
        loadOrders();
    });
    

    displayProducts();

})