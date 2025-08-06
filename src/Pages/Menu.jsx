import React, { useState } from 'react';
import './Menu.css';

const itemsPerPage = 16;

function Menu() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');

  const items = Array.from({ length: 100 }, (_, i) => `Cuadro ${i + 1}`);
  const filteredItems = items.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="menu-container">
      <header className="navbar">
        <input
          type="text"
          className="filter-input"
          placeholder="Filtrar cuadros..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); 
          }}
        />
      </header>

      <aside className="sidebar"></aside>

      <main className="main-content">
        <div className="grid">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div key={index} className="grid-item">
                {item}
              </div>
            ))
          ) : (
            <div className="no-results">No se encontraron resultados</div>
          )}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Menu;

