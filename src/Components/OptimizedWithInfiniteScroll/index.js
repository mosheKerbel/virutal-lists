import React, { memo, useCallback, useState } from "react";
import VirtualScroll from "./VirtualScroll";
import "./styles.css";

const Item = memo(({ index }) => (
  <div
    style={{
      height: 30 + (index % 10) * 5,
      lineHeight: "30px",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 10px"
    }}
    className="row"
    key={index}
  >
    <img
      alt={index}
      style={{borderRadius: "50%"}}
      src={`https://i.pravatar.cc/50?img=${index % 50 + 1}`}
    />
    row index {index}
  </div>
));

function App() {
  const [items, setItems] = useState(Array.from({ length: 100 }).map((_, index) => index));

  const loadMoreItems = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItems = Array.from({ length: 50 }).map((_, index) => index + items.length);
        setItems(prevItems => [...prevItems, ...newItems]);
        resolve();
      }, 1000);
    });
  }, [items]);

  const getChildHeight = useCallback(index => (30 + (index % 10 * 5)), []);
  return (
    <div className="App">
      <h1>Optimized with Infinite Scroll</h1>
      <VirtualScroll
        itemCount={items.length}
        height={800}
        getChildHeight={getChildHeight}
        Item={Item}
        loadMoreItems={loadMoreItems}
      />
    </div>
  );
}

export default App;
