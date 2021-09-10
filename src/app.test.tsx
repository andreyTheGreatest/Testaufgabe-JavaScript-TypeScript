import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import MyForm from "./components/MyForm";
import { GridItem } from "./utils";

describe("MyGrid", () => {
  it("render form", () => {
    render(<MyForm />);
    expect(screen.getByLabelText(/grid width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/grid height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/item width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/item width/i)).toBeInTheDocument();
  });
});

const setupAllElements = async (gridItems?: GridItem[]) => {
  const utils = render(<MyForm gridItems={gridItems} />);
  const itemWidth = utils.getByLabelText(/item width/i) as HTMLInputElement;
  const itemHeight = utils.getByLabelText(/item height/i) as HTMLInputElement;
  const setButton = screen.getByRole("setButton");
  const addButton = utils.getByText(/add/i);
  const itemButton = (await utils.findAllByRole("tab")).find(
    (element) => (element as HTMLButtonElement).textContent === "Item"
  );
  return {
    itemWidth,
    itemHeight,
    addButton,
    itemButton,
    setButton,
    utils,
  };
};

describe("events on input interactions", () => {
  it("check error msg appearence on out of bounds grid width", async () => {
    render(<MyForm />);
    const gridWidth = screen.getByLabelText(/grid width/i) as HTMLInputElement;
    const setButton = screen.getByRole("setButton");
    expect(screen.queryByText(/max width/i)).not.toBeInTheDocument(); // 12 is default and less than allowed 18, hence no error
    userEvent.clear(gridWidth);
    userEvent.type(gridWidth, "23"); // 23 is more than allowed 18
    userEvent.click(setButton);
    await waitFor(
      () => expect(screen.getByText(/max width/i)).toBeInTheDocument() // hence expecting error
    );
  });

  it("check error msg appearence on out of bounds grid height", async () => {
    render(<MyForm />);
    const gridHeight = screen.getByLabelText(
      /grid height/i
    ) as HTMLInputElement;
    const setButton = screen.getByRole("setButton");
    expect(screen.queryByText(/max height/i)).not.toBeInTheDocument(); // 6 is default and equal to allowed 6, hence no error
    userEvent.clear(gridHeight);
    userEvent.type(gridHeight, "8"); // 8 is more than allowed 6
    userEvent.click(setButton);
    await waitFor(
      () => expect(screen.getByText(/max height/i)).toBeInTheDocument() // hence expecting error
    );
  });

  it("grid height and width are within bounds", async () => {
    render(<MyForm />);
    const gridWidth = screen.getByLabelText(/grid width/i) as HTMLInputElement;
    const gridHeight = screen.getByLabelText(
      /grid height/i
    ) as HTMLInputElement;
    const setButton = screen.getByRole("setButton");
    expect(screen.queryByText(/max ^(height|width)$/i)).not.toBeInTheDocument(); // 12 is default and less than allowed 18, hence no error
    userEvent.clear(gridHeight);
    userEvent.clear(gridWidth);
    userEvent.type(gridHeight, "4"); // 4 is less than allowed 6
    userEvent.type(gridWidth, "11"); // 11 is less than allowed 18
    userEvent.click(setButton);
    await waitFor(
      () =>
        expect(
          screen.queryByText(/max ^(height|width)$/i)
        ).not.toBeInTheDocument() // hence not expecting an error
    );
  });

  it("check error msg appearence on out of bounds item width", async () => {
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements();
    const gridWidth = screen.getByLabelText(/grid width/i) as HTMLInputElement;

    expect(screen.queryByText(/out of bounds/i)).not.toBeInTheDocument(); // no input, or previously in bounds input
    userEvent.click(itemButton); // go to item input
    userEvent.type(itemHeight, "1"); // set in bounds height
    userEvent.type(itemWidth, +gridWidth.value + 1 + ""); // value + 1 is out of bounds (0, value)
    userEvent.click(addButton);
    await waitFor(() => {
      const errorElement = screen.getByText(/out of bounds/i);
      expect(errorElement).toBeInTheDocument(); // hence expecting an error
    });
  });

  it("check error msg appearence on out of bounds item height", async () => {
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements();
    const gridHeight = screen.getByLabelText(
      /grid height/i
    ) as HTMLInputElement;
    expect(screen.queryByText(/out of bounds/i)).not.toBeInTheDocument(); // no input, or previously in bounds input
    userEvent.click(itemButton); // go to item input
    userEvent.type(itemWidth, "1"); // set in bounds width
    userEvent.type(itemHeight, +gridHeight.value + 1 + ""); // value + 1 is out of bounds (0, value)
    userEvent.click(addButton);
    await waitFor(() => {
      const errorElement = screen.getByText(/out of bounds/i);
      expect(errorElement).toBeInTheDocument(); // hence expecting an error
    });
  });
});

describe("insertion algorithm", () => {
  it("insert into emty grid", async () => {
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements();
    userEvent.click(itemButton);
    // setting width and height of element in bounds of given grid (w: 12, h: 6)
    userEvent.type(itemWidth, "12");
    userEvent.type(itemHeight, "5");
    userEvent.click(addButton);
    const role = "0, 0"; // the grid is empty, thus expecting the very first position
    await waitFor(() => {
      const addedContainer = screen.getByLabelText(role);
      expect(addedContainer).toBeInTheDocument();
    });
  });

  it("ensure it finds optimal position", async () => {
    const items: GridItem[] = [
      { h: 2, w: 6, x: 0, y: 0 },
      { h: 2, w: 5, x: 7, y: 0 },
    ]; // leaving a place for width 1 at (x: 6, y: 0)
    const role = "6, 0"; // thus expecting such position
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements(items);
    userEvent.click(itemButton);
    // adding an item with corresponding params (w: 1, h: 1)
    userEvent.type(itemWidth, "1");
    userEvent.type(itemHeight, "1");
    userEvent.click(addButton);
    await waitFor(() => {
      const addedContainer = screen.getByLabelText(role);
      expect(addedContainer).toBeInTheDocument();
    });
  });

  it("ensure further placement although no place left", async () => {
    const items: GridItem[] = [{ h: 6, w: 12, x: 0, y: 0 }]; // leaving no place on the grid
    const role = "0, 6"; // thus expecting such "out of bounds" position
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements(items);
    userEvent.click(itemButton);
    // adding an item with params within bounds
    userEvent.type(itemWidth, "2");
    userEvent.type(itemHeight, "3");
    userEvent.click(addButton);
    await waitFor(() => {
      const addedContainer = screen.getByLabelText(role);
      expect(addedContainer).toBeInTheDocument();
    });
  });

  it("ensure further placement although there is place for smaller item", async () => {
    const items: GridItem[] = [{ h: 5, w: 12, x: 0, y: 0 }]; // leaving place for item with height 1
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements(items);
    userEvent.click(itemButton);
    // adding an item with params within bounds but with height > 1
    userEvent.type(itemWidth, "2");
    userEvent.type(itemHeight, "3");
    userEvent.click(addButton);
    const role = "0, 5"; // anyway expecting placement on chosen position
    await waitFor(() => {
      const addedContainer = screen.getByLabelText(role);
      expect(addedContainer).toBeInTheDocument();
    });
  });

  it("check intersection with other item", async () => {
    const items: GridItem[] = [
      { h: 1, w: 6, x: 0, y: 0 },
      { h: 1, w: 12, x: 0, y: 1 },
    ]; // there is place only for item with height 1
    const { itemWidth, itemHeight, addButton, itemButton } =
      await setupAllElements(items);
    userEvent.click(itemButton);
    // adding an item with params within bounds but height > 1
    userEvent.type(itemWidth, "5");
    userEvent.type(itemHeight, "3");
    userEvent.click(addButton);
    const role = "0, 2"; // thus expecting such position as there is no place earlier
    await waitFor(() => {
      const addedContainer = screen.getByLabelText(role);
      expect(addedContainer).toBeInTheDocument();
    });
  });
});
