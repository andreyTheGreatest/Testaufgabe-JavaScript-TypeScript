import {
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  fieldToError,

  gridBoundsCheck,

  GridItem,

  itemOutOfBoundsCheck
} from "../utils";
import GridObject, { GridObjectRef } from "./GridObject";
import { Layout } from "./Layout";
import { MyInput } from "./MyInput";

interface MyFormProps {
  gridItems?: GridItem[]
}


export const MyForm: React.FC<MyFormProps> = ({gridItems}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [gridHeight, setGridHeight] = useState(6);
  const [gridWidth, setGridWidth] = useState(12);
  const gridRef = useRef<GridObjectRef>();
  return (
    <Layout>
      <Tabs index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>Grid</Tab>
          <Tab>Item</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Formik
              initialValues={{
                newGridHeight: gridHeight,
                newGridWidth: gridWidth,
              }}
              onSubmit={(values, { setErrors }) => {
                const res = gridBoundsCheck({
                  w: values.newGridWidth,
                  h: values.newGridHeight,
                });
                if (res) setErrors(fieldToError(res));
                else {
                  gridRef?.current?.resetGrid();
                  setGridHeight(values.newGridHeight);
                  setGridWidth(values.newGridWidth);
                  setTabIndex(1);
                }
              }}
            >
              <Form key="grid">
                <Flex justifyContent="space-between">
                  <MyInput
                    name="newGridWidth"
                    type="number"
                    label="Grid Width"
                  />
                  <MyInput
                    name="newGridHeight"
                    type="number"
                    label="Grid Height"
                  />
                  <Button
                    mt={8}
                    type="submit"
                    colorScheme="blue"
                    role="setButton"
                  >
                    Set
                  </Button>
                </Flex>
              </Form>
            </Formik>
          </TabPanel>
          <TabPanel>
            <Formik
              initialValues={{ itemHeight: "", itemWidth: "" }}
              onSubmit={(values, { setErrors }) => {
                const { itemHeight, itemWidth } = values;
                const { x, y } = gridRef?.current?.getNewItemPosition(+itemWidth, +itemHeight);
                const itemBoundsResult = itemOutOfBoundsCheck({ x, y });
                if (itemBoundsResult) setErrors(fieldToError(itemBoundsResult));
                else if (x >= 0 && y >= 0)
                  gridRef?.current?.addItems([{h: +itemHeight, w: +itemWidth, x, y}]);
                if (y + +itemHeight > gridHeight)
                  setGridHeight((prevVal) => prevVal * 2);
              }}
            >
              <Form key="item">
                <Flex justifyContent="space-between">
                  <MyInput name="itemWidth" label="Item Width" type="number" />
                  <MyInput
                    name="itemHeight"
                    label="Item Height"
                    type="number"
                  />
                  <Button
                    mt={8}
                    type="submit"
                    colorScheme="blue"
                    role="addButton"
                  >
                    Add
                  </Button>
                  <Button
                    mt={8}
                    onClick={gridRef?.current?.resetGrid}
                    colorScheme="red"
                  >
                    Reset
                  </Button>
                </Flex>
              </Form>
            </Formik>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <GridObject gridHeight={gridHeight} gridWidth={gridWidth} ref={gridRef} gridItems={gridItems} />
    </Layout>
  );
};

export default MyForm;
