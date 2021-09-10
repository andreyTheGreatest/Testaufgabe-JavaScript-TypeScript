# My solution to Optimax Energy Typescript Task

The core of it was to write an algorithm that places new items optimally to the existing ones on the grid, as the react-grid-layout library does not provide such solution and simply places them vertically.

The main idea is on every insertion to traverse the grid, prioritizing row-wise, than column-wise traversal, and try to find a position where an item with given properties (width, height) could be placed.

In order to traverse the grid with items, the matrix representation of both of them together is built before each insertion.

The programm using React, Typescript, Next JS and Chakra UI was built on top of this algorythm realisation, so users can try it out.



## Demo

![video-demo in mp4](data/video-demo.mp4)

## How to use

Used simple command to setup everything with Chakra:

```bash
npx create-next-app --example with-chakra-ui with-chakra-ui-app
# or
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```
