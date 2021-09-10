import { Box, Center } from "@chakra-ui/react";
import React from "react";

export type LayoutVariant = "small" | "regular";

interface LayoutProps {
  variant?: LayoutVariant;
}

export const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return (
    <Box
      mt={8}
      m="auto"
      maxW="1000px"
      w="100%"
    >
      {children}
    </Box>
  );
};
