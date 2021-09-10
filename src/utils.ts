// type for Grid element
export type GridItem = {
  // width
  w: number;
  // height
  h: number;
  // starting position on x axis
  x?: number;
  // starting position on y axis
  y?: number;
};

// Grid type
export type Grid = {
  // width
  w: number;
  // height
  h: number;
};

// item position type
export type Position = {
  x: number;
  y: number;
};

// input field error type
export type FieldError = {
  field: string;
  error: string;
};

/**
 *  The following function is designed to determine where to insert new item to the grid
 *  by simply traversing matrix representation of grid plus the items it already contains,
 *  thus trying to find the free spot, prioritizing column-wise iteration. If found spot is
 *  suitable for the incoming item, the function returns the coordinates of the given spot,
 *  otherwise continues its search.
 *  @param   {Grid} grid               Grid object
 *  @param   {GridItem[]} gridItems    Array of items already inside grid
 *  @param   {GridItem} itemToPut      Item object to be inserted
 *  @return  {Position}                Spot coordinates, otherwise corresponding error
 */
export const getOptimizedPosition2 = (
  grid: Grid,
  gridItems: GridItem[],
  itemToPut: GridItem
): Position => {
  if (itemToPut.w <= grid.w && itemToPut.w > 0 && itemToPut.h > 0 && itemToPut.h <= grid.h) {
    let gridMatrix = getGridWithItemsMatrix(grid, gridItems);
    // traverse grid by each row
    for (let gridRow = 0; gridRow < grid.h; gridRow++) {
      // traverse grid by each column
      for (let gridColumn = 0; gridColumn < grid.w; gridColumn++) {
        if (gridRow === grid.h - 1 && gridColumn === grid.w - 1) {
          grid.h *= 2;
          gridMatrix = getGridWithItemsMatrix(grid, gridItems);
        }
        // find a free spot
        if (gridMatrix[gridRow][gridColumn] === 0) {
          // using flag to pinpoint success/failure on intersection
          let flag = true;
          // check for enough place til the end of the row
          if (gridColumn + itemToPut.w > grid.w) continue;
          // double grid`s height if item`s height plus position exceeds it
          if (gridRow + itemToPut.h > grid.h) {
            grid.h *= 2;
            gridMatrix = getGridWithItemsMatrix(grid, gridItems);
          }
          // checking item`s coverage on intersection with another item
          for (let i = gridRow; i < gridRow + itemToPut.h; i++) {
            for (let j = gridColumn; j < gridColumn + itemToPut.w; j++) {
              // break on intersection
              if (gridMatrix[i][j] === 1) {
                flag = false; // failed to insert
                break;
              }
            }
          }

          if (flag)
            // on success return current spot`s coordinates
            return {
              x: gridColumn,
              y: gridRow,
            };
          else continue; // on failure continue searching
        }
      }
    }
  } else if (itemToPut.w > grid.w || itemToPut.w <= 0) {
    return {
      x: -1, // highlight x axis, hinting that width out of bounds
      y: 0,
    };
  } else if (itemToPut.h > grid.h || itemToPut.h <= 0) {
    return {
      x: 0,
      y: -1, // same for y axis
    };
  }
};

/**
 *  A helper function that creates a zero-filled matrix, then marks with 1s all
 *  positions where an item, that already is placed inside the grid, is encountered
 *  @param   {Grid} grid               Grid object
 *  @param   {GridItem[]} gridItems    Array of items already inside grid
 *  @return  {number[][]}              2D representation of grid with items inside it
 */
export const getGridWithItemsMatrix = (
  grid: Grid,
  gridItems: GridItem[]
): number[][] => {
  // create a zero-filled matrix
  let gridMatrix: number[][] = Array(grid.h)
    .fill(0)
    .map(() => Array(grid.w).fill(0));
  // take each item and put 1 in every position in matrix it covers
  for (let item of gridItems) {
    const { x, y, w, h } = item;
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        gridMatrix[i][j] = 1;
      }
    }
  }
  return gridMatrix;
};

/**
 *  A helper function that creates errors for corresponding item field
 *  @param   {Position} position       Item`s starting coordinates
 *  @return  {FieldError | null}       Error if present
 */
export const itemOutOfBoundsCheck = ({ x, y }: Position): FieldError | null => {
  if (x < 0) return { field: "itemWidth", error: "Out of bounds width!" };
  else if (y < 0)
    return { field: "itemHeight", error: "Out of bounds height!" };
  else null;
};

/**
 *  A helper function that creates errors for corresponding grid field.
 *  For safety purposes the width is limited with 18 and height with 6
 *  @param   {Grid} grid               Grid object
 *  @return  {FieldError | null}       Error if present
 */
export const gridBoundsCheck = ({ w, h }: Grid): FieldError | null => {
  if (w < 0 || w > 18)
    return {
      field: "newGridWidth",
      error: "Max width is 18!",
    };
  else if (h < 0 || h > 6)
    return {
      field: "newGridHeight",
      error: "Max height is 6!",
    };

  return null;
};

/**
 *  A helper function that maps field to corresponding field error
 *  @param   {FieldError} grid           Grid object
 *  @return  {object}                        Field to error record
 */
export const fieldToError = (fieldError: FieldError): object => {
  const fieldToError = {};
  fieldToError[fieldError.field] = fieldError.error;
  return fieldToError;
};
