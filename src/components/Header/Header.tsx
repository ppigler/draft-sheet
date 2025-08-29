"use client";

import { DraftContext } from "@/app/providers";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { useContext } from "react";

const Header = () => {
  const { picks, resetPicks, isDraftMode, setIsDraftMode } =
    useContext(DraftContext);
  return (
    <Navbar>
      <NavbarBrand>Draft sheet</NavbarBrand>
      <NavbarContent>
        <Button
          onPress={resetPicks}
          color="danger"
          disabled={picks.length === 0}
        >
          Reset picks
        </Button>
        <Button
          onPress={() => setIsDraftMode((prev) => !prev)}
          color={isDraftMode ? "success" : "primary"}
        >
          {isDraftMode ? "Draft Mode" : "Edit Mode"}
        </Button>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
