document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products');
    const productsContainer2 = document.getElementById('products2');
    const categoryCountsContainer = document.getElementById('category-counts');

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
    function displayProductsTable(container, products) {
        const productsTable = document.createElement('table');
        productsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Categoria</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.nome}</td>
                        <td>${product.quantidade}</td>
                        <td>${product.categoria}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        container.appendChild(productsTable);
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
            countElement.textContent = `Categoria: ${category} - ${count}`;
            categoryCountsContainer.appendChild(countElement);
        });
    }

    // Função principal para buscar e exibir os dados de produtos com menor e maior quantidade em estoque
    async function displayProducts() {
        try {
            const productsLowStock = await fetchData('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto?sortBy=quantidade&order=asc');
            displayProductsTable(productsContainer, productsLowStock);

            const productsHighStock = await fetchData('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto?sortBy=quantidade&order=desc');
            displayProductsTable(productsContainer2, productsHighStock);

            // Use apenas os produtos de menor quantidade para a contagem
            const categoryCounts = countProductsByCategory(productsLowStock);
            displayCategoryCounts(categoryCounts);
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
    }

    displayProducts();
});
