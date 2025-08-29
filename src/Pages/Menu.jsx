import React, { useState, useEffect } from 'react';
import { FaSearch, FaPen, FaHeart, FaShoppingCart, FaStar, FaChevronLeft, FaChevronRight, FaTimes, FaUser } from 'react-icons/fa';
import './Styles/Menu.css';

const itemsPerPage = 16;
const totalProductsToFetch = 50;

// Función utilitaria mejorada para convertir buffer a base64
function bufferToBase64(buffer) {
  if (Array.isArray(buffer)) {
    buffer = new Uint8Array(buffer);
  }
  
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function Menu() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [countItems, setCountItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: currentPage,
            length: totalProductsToFetch,
            search: filter,
          }),
        });

        const response = await res.json();
        console.log("Respuesta completa:", response);

        const data = response.data || response;
        
        const mappedProducts = Array.isArray(data.products) 
          ? data.products.map(product => {
              let imageUrl = null;
              if (product.LargePhoto && product.LargePhoto.data) {
                try {
                  const base64String = bufferToBase64(product.LargePhoto.data);
                  imageUrl = `data:image/jpeg;base64,${base64String}`;
                } catch (error) {
                  console.error(`Error procesando imagen para producto ${product.ProductKey}:`, error);
                }
              }

              return {
                id: product.ProductKey,
                name: product.EnglishProductName || 
                      product.ProductAlternateKey || 
                      `Producto ${product.ProductKey}`,
                description: product.EnglishDescription || 
                            (product.Color ? `Color: ${product.Color}` : '') +
                            (product.Size ? ` | Tamaño: ${product.Size}` : '') +
                            (product.Class ? ` | Clase: ${product.Class.trim()}` : '') ||
                            'Sin descripción disponible',
                price: product.ListPrice || 
                       product.StandardCost || 
                       product.DealerPrice || 
                       0,
                image: imageUrl,
                color: product.Color,
                size: product.Size,
                weight: product.Weight,
                weightUnit: product.WeightUnitMeasureCode,
                sizeUnit: product.SizeUnitMeasureCode,
                status: product.Status,
                productLine: product.ProductLine,
                modelName: product.ModelName,
                originalData: product,
                rating: Math.floor(Math.random() * 5) + 1, // Rating aleatorio para demo
                reviews: Math.floor(Math.random() * 100) // Reviews aleatorias para demo
              };
            })
          : [];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = mappedProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setCountItems(mappedProducts.length);
      } catch (error) {
        console.error('Error al traer productos:', error);
        setProducts([]);
        setCountItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filter]);

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const toggleCart = (productId) => {
    const newCart = new Set(cart);
    if (newCart.has(productId)) {
      newCart.delete(productId);
    } else {
      newCart.add(productId);
    }
    setCart(newCart);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    // Parte para poner comentarios de ejemplo
    
    document.body.style.overflow = 'hidden'; 
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto'; 
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/comments/createComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          userId: 5,
          content: comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newComment = {
          id: Date.now(), 
          user: { name: 'Tú' },
          content: comment,
          date: new Date().toISOString(),
        };
        
        setComments([...comments, newComment]);
        setComment('');
        alert('Comentario enviado con éxito!');
      } else {
        alert('Error al enviar el comentario: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el comentario');
    } finally {
      setCommentLoading(false);
    }
  };

  const totalPages = countItems > 0 ? Math.ceil(countItems / itemsPerPage) : 1;

  return (
    <div className="menu-container">
      <header className="navbar">
        <div className="navbar-left">
          <span className="logo">
            <FaPen className="logo-icon" /> Review
          </span>
        </div>
        <div className="navbar-center">
          <div className="search-container">
            <input
              type="text"
              className="filter-input"
              placeholder="Buscar productos..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
        <div className="navbar-right">
          <div className="cart-icon">
            <FaShoppingCart />
            {cart.size > 0 && <span className="cart-count">{cart.size}</span>}
          </div>
        </div>
      </header>

      <div className="content-container">
        <aside className="sidebar">
          <h3>Filtros</h3>
          <div className="filter-section">
            <h4>Categorías</h4>
            <label>
              <input type="checkbox" /> Ropa
            </label>
            <label>
              <input type="checkbox" /> Accesorios
            </label>
            <label>
              <input type="checkbox" /> Calzado
            </label>
          </div>
          <div className="filter-section">
            <h4>Precio</h4>
            <label>
              <input type="checkbox" /> $0 - $50
            </label>
            <label>
              <input type="checkbox" /> $50 - $100
            </label>
            <label>
              <input type="checkbox" /> $100+
            </label>
          </div>
          <div className="filter-section">
            <h4>Color</h4>
            <div className="color-filters">
              <span className="color-dot red"></span>
              <span className="color-dot blue"></span>
              <span className="color-dot green"></span>
              <span className="color-dot black"></span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="results-header">
            <h2>Productos ({countItems})</h2>
            <div className="sort-options">
              <select>
                <option>Ordenar por: Más relevantes</option>
                <option>Precio: Menor a mayor</option>
                <option>Precio: Mayor a menor</option>
                <option>Mejor valorados</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="product-card" onClick={() => openProductModal(product)}>
                      <div className="card-header">
                        <span className="product-badge">Nuevo</span>
                        <button 
                          className={`favorite-btn ${favorites.has(product.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <FaHeart />
                        </button>
                      </div>
                      <div className="image-container">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {!product.image || product.image === null ? (
                          <div className="no-image">
                            Sin imagen disponible
                          </div>
                        ) : null}
                        <button 
                          className={`cart-btn ${cart.has(product.id) ? 'added' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCart(product.id);
                          }}
                        >
                          <FaShoppingCart />
                          {cart.has(product.id) ? 'Agregado' : 'Agregar al carrito'}
                        </button>
                      </div>
                      
                      <div className="product-info">
                        <h3 className="product-name">{product.name || 'Sin nombre'}</h3>
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < product.rating ? 'star filled' : 'star'} />
                          ))}
                          <span className="review-count">({product.reviews})</span>
                        </div>
                        <p className="product-description">{product.description || 'Sin descripción'}</p>
                        <div className="price-container">
                          <span className="price">${product.price.toFixed(2)}</span>
                          {product.originalData.StandardCost && (
                            <span className="original-price">
                              ${product.originalData.StandardCost.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="product-details">
                          <span className="detail-item">{product.color || 'Color variado'}</span>
                          <span className="detail-item">{product.size || 'Talla única'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta ajustando los filtros o los términos de búsqueda</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'active' : ''}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal de Producto */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeProductModal}>
              <FaTimes />
            </button>
            
            <div className="modal-content">
              <div className="modal-left">
                <div className="modal-image-container">
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="modal-product-image"
                    />
                  ) : (
                    <div className="modal-no-image">
                      Sin imagen disponible
                    </div>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button 
                    className={`modal-favorite-btn ${favorites.has(selectedProduct.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(selectedProduct.id)}
                  >
                    <FaHeart />
                    {favorites.has(selectedProduct.id) ? 'En favoritos' : 'Agregar a favoritos'}
                  </button>
                  
                  <button 
                    className={`modal-cart-btn ${cart.has(selectedProduct.id) ? 'added' : ''}`}
                    onClick={() => toggleCart(selectedProduct.id)}
                  >
                    <FaShoppingCart />
                    {cart.has(selectedProduct.id) ? 'En carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
              
              <div className="modal-right">
                <h2 className="modal-product-name">{selectedProduct.name}</h2>
                
                <div className="modal-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < selectedProduct.rating ? 'star filled' : 'star'} />
                  ))}
                  <span className="modal-review-count">({selectedProduct.reviews} reseñas)</span>
                </div>
                
                <div className="modal-price-container">
                  <span className="modal-price">${selectedProduct.price.toFixed(2)}</span>
                  {selectedProduct.originalData.StandardCost && (
                    <span className="modal-original-price">
                      ${selectedProduct.originalData.StandardCost.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="modal-description">
                  <h3>Descripción</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="modal-details">
                  <h3>Detalles del producto</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Color:</span>
                      <span className="detail-value">{selectedProduct.color || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tamaño:</span>
                      <span className="detail-value">{selectedProduct.size || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Peso:</span>
                      <span className="detail-value">
                        {selectedProduct.weight} {selectedProduct.weightUnit || 'kg'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estado:</span>
                      <span className="detail-value">{selectedProduct.status || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Línea de producto:</span>
                      <span className="detail-value">{selectedProduct.productLine || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Modelo:</span>
                      <span className="detail-value">{selectedProduct.modelName || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="modal-comments">
                  <h3>Comentarios</h3>
                  
                  <div className="comments-list">
                    {comments.length > 0 ? (
                      comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <div className="user-avatar">
                              <FaUser />
                            </div>
                            <div className="user-info">
                              <span className="user-name">{comment.user.name}</span>
                              <span className="comment-date">
                                {new Date(comment.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    )}
                  </div>
                  
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <h4>Deja tu comentario</h4>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escribe tu comentario aquí..."
                      rows="4"
                    />
                    <button 
                      type="submit" 
                      className="submit-comment-btn"
                      disabled={commentLoading || !comment.trim()}
                    >
                      {commentLoading ? 'Enviando...' : 'Enviar comentario'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;