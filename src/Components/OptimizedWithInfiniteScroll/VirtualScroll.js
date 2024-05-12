import React, { memo, useMemo, useRef, useState, useEffect, useCallback } from "react";

const useScrollAware = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const onScroll = useCallback(e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight && !loading) {
      setLoading(true);
    }
    setScrollTop(scrollTop);
  }, [loading]);

  useEffect(() => {
    const scrollContainer = ref.current;
    setScrollTop(scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  return [scrollTop, ref, loading, setLoading];
};

const VirtualScroll = ({
  Item,
  itemCount,
  height,
  getChildHeight,
  renderAhead = 20,
  loadMoreItems
}) => {
  const childPositions = useMemo(() => {
    let results = [0];
    for (let i = 1; i < itemCount; i++) {
      results.push(results[i - 1] + getChildHeight(i - 1));
    }
    return results;
  }, [getChildHeight, itemCount]);

  const [scrollTop, ref, loading, setLoading] = useScrollAware();

  useEffect(() => {
    if (!loading) {
      const scrollContainer = ref.current;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const threshold = 400;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        setLoading(true);
        loadMoreItems().then(() => setLoading(false));
      }
    }
  }, [scrollTop, loading, loadMoreItems, setLoading]);

  const totalHeight = childPositions[itemCount - 1] + getChildHeight(itemCount - 1);

  const firstVisibleNode = useMemo(
    () => findStartNode(scrollTop, childPositions, itemCount),
    [scrollTop, childPositions, itemCount]
  );

  const startNode = Math.max(0, firstVisibleNode - renderAhead);

  const lastVisibleNode = useMemo(
    () => findEndNode(childPositions, firstVisibleNode, itemCount, height),
    [childPositions, firstVisibleNode, itemCount, height]
  );
  const endNode = Math.min(itemCount - 1, lastVisibleNode + renderAhead);
  const visibleNodeCount = endNode - startNode + 1;
  const offsetY = childPositions[startNode];

  const visibleChildren = useMemo(
    () =>
      new Array(visibleNodeCount)
        .fill(null)
        .map((_, index) => (
          <Item key={index + startNode} index={index + startNode} />
        )),
    [startNode, visibleNodeCount, Item]
  );

  useEffect(() => {
    if (loading) {
      loadMoreItems().then(() => setLoading(false));
    }
  }, [loading, loadMoreItems, setLoading]);

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
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                borderTop: "1px solid #ccc",
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                background: "#fff"
              }}
            >
              Loading more items...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function findStartNode(scrollTop, nodePositions, itemCount) {
  for (let i = 0; i < itemCount; i++) {
    if (nodePositions[i] > scrollTop) {
      return Math.max(0, i - 1);
    }
  }
  return itemCount - 1;
}

function findEndNode(nodePositions, startNode, itemCount, height) {
  let endNode;
  for (endNode = startNode; endNode < itemCount; endNode++) {
    if (nodePositions[endNode] > nodePositions[startNode] + height) {
      return endNode;
    }
  }
  return endNode;
}

export default memo(VirtualScroll);

