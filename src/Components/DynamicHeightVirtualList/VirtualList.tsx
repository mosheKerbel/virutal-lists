import { useEffect, useMemo, useRef, useState } from "react";

type VirtualListProps = {
    itemsCount: number;
    getItemHeight: (itemId: number) => number;
    listHeight: number;
    itemRender: React.FC<{id: number}>;
    bufferSize?: number,
}
const VirtualList: React.FC<VirtualListProps> = ({getItemHeight, itemsCount, listHeight, itemRender: Item, bufferSize = 10}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const onScrollHandler = (e: any) => setScrollTop(e.target.scrollTop);

    useEffect(() => {
        const scrollContainer = containerRef.current;
        scrollContainer?.addEventListener("scroll", onScrollHandler);
        return () => scrollContainer?.removeEventListener("scroll", onScrollHandler);
    }, []);

    const itemsPositions = useMemo(() => {
        let results = [0];
        for (let i = 1; i < itemsCount; i++) {
            results.push(results[i-1] + getItemHeight(i-1));
        }
        return results;
    }, [getItemHeight, itemsCount]);

    const findStartNode = () => {
        for (let i = 0; i < itemsCount; i++) {
            if (itemsPositions[i] >= scrollTop) {
                return Math.max(0, i - 1); // todo - why
            }
        }
        return itemsCount - 1;
    }

    const findEndNode = (startNode: number) => {
        for (let endNode = startNode; endNode < itemsCount; endNode++) {
            if (itemsPositions[endNode] > itemsPositions[startNode] + listHeight) {
                return endNode;
            }
        }
        return itemsCount - 1;
    }

    const firstVisibleNode = findStartNode();
    const firstNodeId = Math.max(0, firstVisibleNode - bufferSize);
    const lastNodeId = Math.min(findEndNode(firstVisibleNode) + bufferSize, itemsCount - 1);
    const getVisibleItems = () => {
        return (
          <>
            {Array.from({ length: lastNodeId - firstNodeId + 1 }, (_, i) => {
              return <Item key = {`item${i}`} id={firstNodeId + i} />;
            })}
          </>
        );
      };

    const topOffset = itemsPositions[firstNodeId];
    const totalHeight = itemsPositions[itemsCount - 1] + getItemHeight(itemsCount - 1);
    return (
        <div ref={containerRef} 
            style={{
                height: listHeight,  
                border:"1px solid #000", 
                overflow: "auto",
                position: "relative"
            }}>
            <div style={{
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: totalHeight, 
                overflow: "hidden"}}>
            <div style = {{
                position: "absolute", 
                top: topOffset, 
                left: 0, 
                width: "100%"}}>
                {getVisibleItems()}
            </div>
            </div>
        </div>
    );
}

export default VirtualList;