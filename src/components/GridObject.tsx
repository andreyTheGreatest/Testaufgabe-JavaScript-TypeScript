import { Box } from "@chakra-ui/react";
import randomColor from "randomcolor";
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState
} from "react";
import {
  Responsive, WidthProvider
} from "react-grid-layout";
import { getOptimizedPosition2, GridItem, Position } from "../utils";

interface GridObjectProps {
  children?: ReactNode;
  gridWidth: number;
  gridHeight: number;
  gridItems?: GridItem[];
}

export interface GridObjectRef {
  addItems: (items: GridItem[]) => void;
  getNewItemPosition: (itemWidth: number, itemHeight: number) => Position;
  resetGrid: () => void;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const GridObject = forwardRef<GridObjectRef, GridObjectProps>(
  ({ gridWidth, gridHeight, gridItems }, ref) => {
    const [items, setItems] = useState(gridItems ? gridItems : []);
    useImperativeHandle(ref, () => ({
      addItems: (items: GridItem[]) => {
        setItems((prevItems) => [...prevItems, ...items]);
      },
      getNewItemPosition: (itemWidth: number, itemHeight: number) => {
        return getOptimizedPosition2({ w: gridWidth, h: gridHeight }, items, {
          w: itemWidth,
          h: itemHeight,
        });
      },
      resetGrid: () => setItems([] as GridItem[]),
    }));

    return (
      <ResponsiveGridLayout
        style={{
          border: "solid pink",
          height: gridHeight * 73,
        }}
        cols={{ lg: gridWidth, md: gridWidth }}
        rowHeight={60}
        onLayoutChange={(layout) => {
          setItems(
            layout.map((item) => {
              return { x: item.x, y: item.y, h: item.h, w: item.w };
            })
          );
        }}
      >
        {items.map((item: GridItem, index: number) => {
          const color = randomColor({ seed: index });
          const role = `${item.x}, ${item.y}`;
          return (
            <Box
              aria-label={role}
              key={color}
              bgColor={color}
              data-grid={item}
            ></Box>
          );
        })}
      </ResponsiveGridLayout>
    );
  }
);

export default GridObject;
