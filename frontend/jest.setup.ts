/// <reference types="jest" />
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt?: string;
    className?: string;
    fill?: boolean;
    sizes?: string;
  }) =>
    React.createElement("img", {
      src,
      alt: alt ?? "",
      className,
      "data-testid": "next-image",
    }),
}));

afterEach(() => {
  cleanup();
});
