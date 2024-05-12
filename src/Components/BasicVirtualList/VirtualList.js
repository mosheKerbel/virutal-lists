import React, { memo, useMemo, useRef, useState, useEffect } from "react";

const VirtualList = ({
  Item,
  itemCount,
  height,
  childHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();

  const onScroll = e => setScrollTop(e.target.scrollTop);

  useEffect(() => {
    const scrollContainer = ref.current;
    setScrollTop(scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  const calcChildPositions = () => {
    let results = [0];
    for (let i = 1; i < itemCount; i++) {
      results.push(results[i - 1] + childHeight);
    }
    return results;
  };

  const childPositions = calcChildPositions();
  const totalHeight = childPositions[itemCount - 1] + childHeight;

  const firstVisibleNode = Math.floor(scrollTop / childHeight);

  const startNode = Math.max(0, firstVisibleNode);

  const endNode = findEndNode(
        startNode,
        height,
        itemCount,
        childHeight);

  const visibleNodeCount = endNode - startNode + 1;
  const offsetY = childPositions[startNode];

  const visibleChildren = Array.from({ length: visibleNodeCount }, (_, index) => (
    <Item key={index + startNode} index={index + startNode} />
  ));


  return (
    <div style={{ position: "relative", height, overflow: "auto" }} ref={ref}>
      <div
        className="viewport"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: totalHeight,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: offsetY,
            left: 0,
            width: "100%"
          }}
        >
          {visibleChildren}
        </div>
      </div>
    </div>
  );
};

function findEndNode(startNode, viewportHeight, itemCount, childHeight) {
  const itemsInView = Math.ceil(viewportHeight / childHeight);
  return Math.min(startNode + itemsInView, itemCount - 1);
}

export default memo(VirtualList);
