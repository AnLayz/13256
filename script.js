document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.getElementById('theme-toggle');
  const articlesContainer = document.getElementById('articles-container');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-articles');
  const cardTitle = document.getElementById('popular-article-title');
  const Mostpopular = document.getElementById('most-popular');

  let Articles = [];
  let currentCategory = 'All';

  // Fetch articles from the JSON file
  fetch('Articles.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        Articles = data;
        displayArticles(Articles); // Initial display
        setupCategoryFilter();
      })
  function displayMostpopular(articles){
    Mostpopular.innerHTML = '';
    
  }
  // Function to display articles based on filter and sorting
  function displayArticles(articles) {
    articlesContainer.innerHTML = ''; // Clear container
    // const commonArticle = articles.reduce((prev, current) => (prev.views > current.views) ? prev : current);
    articles.forEach(article => {
      const reading = calculateReadingTime(article.wordCount);
      const articleElement = document.createElement('div');
      articleElement.classList.add('article');
      articleElement.innerHTML = `<div card mb-3>
      <div class="card-body">
        <h2>${article.title}</h2>
        <p>Date: ${article.date}</p>
        <p>Category: ${article.category}</p>
        <p>${article.content}</p>
        <p>Views: ${article.views}</p>
        <p> ${reading} min to read</p>
        </div>
        </div>
      `;
      articlesContainer.appendChild(articleElement);
    });
  }

  // Calculate reading time based on word count
  function calculateReadingTime(wordCount) {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Toggle theme functionality
  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });

  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Filter by category
  function filterByCategory(category) {
    currentCategory = category;
    if (category === 'All') {
      filteredArticles = articles;
    } else {
      filteredArticles = articles.filter(article => article.category === category);
    }
    displayArticles(filteredArticles);
  }

  // Sort articles within the filtered category
  function sortArticles() {
    const sortBy = sortSelect.value;
    if (sortBy === 'views') {
      filteredArticles.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'date') {
      filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    displayArticles(filteredArticles);
  }

  // Event listener for category filter
  categoryFilter.addEventListener('click', (event) => {
    const selectedCategory = event.target.getAttribute('data-category');
    filterByCategory(selectedCategory);
    sortSelect.value = ''; // Reset sorting option after category change
  });

  // Event listener for sorting
  sortSelect.addEventListener('change', () => {
    sortArticles();
  });

  // Initially display all articles
  filterByCategory(currentCategory);
});
