import React from 'react';
import './index.scss';
import Collection from './Collection';

// 1. Get all collections (data)
// 2. Render this data to Collection component
// 3. Filter collections and search by name
// 4. Filter by categories (tabs): 
//  4.1 Set active class
//  4.2 filter by categories (docs --> https://github.com/mockapi-io/docs/wiki/Code-examples#filtering)
// 5. Loading for slow internet
// 6. Pagination
// 7. Filtering when selecting a page

const categories = [
  { "name": "All" },
  { "name": "Sea" },
  { "name": "Mountains" },
  { "name": "Architecture" },
  { "name": "Cities" }
];

function App() {
  const [collections, setCollections] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [categoryId, setCategoryId] = React.useState(0); // 0 by default, it means that all categories selected
  const [isLoading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {

    const category = categoryId ? `category=${categoryId}` : '';

    setLoading(true);

    fetch(`https://6770cb342ffbd37a63cd88a6.mockapi.io/Photo-collection?page=${page}&limit=3&${category}`)
      .then((res) => res.json())
      .then((resJson) =>{
        setCollections(resJson);
      })
      .catch(error => {
        console.warn(error);
        alert('Error while receiving data');
      })
      .finally(() => setLoading(false));
  }, [categoryId, page]);
  
  return (
    <div className="App">
      <h1>My photo collection</h1>
      <div className="top">
        <ul className="tags">
          {
            categories.map((category, index) =>( 
              <li
                onClick={() => setCategoryId(index)} 
                className={categoryId === index ? 'active' : ''} 
                key={category.name}>
                {category.name}
              </li>)
          )}
        </ul> 
        <input 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input" 
          placeholder="Search by name..." 
        />
      </div>
      <div className="content">
        {
          isLoading ? (
            <h2>Loading...</h2>
          ) : (
            collections
            .filter(collection => collection.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((collection, index) =>(
              <Collection key={index} name={collection.name} images={collection.photos} />
            ))
          )
        }
      </div>
      <ul className="pagination">
        {
          [...Array(5)].map((_, i) =>(
            <li 
              onClick={() => setPage(i+1)} 
              className={page === i + 1 ? 'active' : ''}>
                {i + 1}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;
