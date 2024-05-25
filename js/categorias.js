document.addEventListener('DOMContentLoaded', function() {
    const categoriesContainer = document.getElementById('categories');

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

    // Função para criar e exibir a tabela para uma categoria específica
    function displayCategoryTable(category, products) {
        const categoryTable = document.createElement('table');
        categoryTable.innerHTML = `
            <caption>${category}</caption>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.nome}</td>
                        <td>${product.quantidade}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        categoriesContainer.appendChild(categoryTable);
    }

    // Função principal para buscar e exibir os dados por categoria
    async function displayDataByCategory() {
        try {
            const categories = await fetchData('https://6651fc7e20f4f4c442796287.mockapi.io/produtos/categoria');
            for (const category of categories) {
                const products = await fetchData(`https://6651fc7e20f4f4c442796287.mockapi.io/produtos/produto?categoria=${category.nome}`);
                displayCategoryTable(category.nome, products);
            }
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
    }

    displayDataByCategory();
});
