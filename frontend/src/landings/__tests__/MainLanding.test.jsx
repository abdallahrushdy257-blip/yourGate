import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

import ThemeContextProvider from "../../context/theme-context";
import MainLanding from "../MainLanding";
import DonationJourney3D from "../main-3d/DonationJourney3D";
import ModulesCarousel3D from "../main-3d/ModulesCarousel3D";
import LiveImpactShowcase from "../main-3d/LiveImpactShowcase";
import { landingTranslations } from "../main-3d/translations";

// Mock matchMedia and IntersectionObserver for JSDOM (re-applied in beforeEach because CRA sets resetMocks: true)
const setupBrowserMocks = (reducedMotion = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: reducedMotion && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  global.IntersectionObserver = class IntersectionObserver {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    setTransform: jest.fn(),
    clearRect: jest.fn(),
    createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    beginPath: jest.fn(),
    arc: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    rect: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
  }));

  HTMLMediaElement.prototype.load = jest.fn();
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
};

beforeEach(() => {
  setupBrowserMocks(false);
});

const renderWithProviders = (ui) =>
  render(<ThemeContextProvider>{ui}</ThemeContextProvider>);

describe("MainLanding Performance & Interactive Suite", () => {
  test("renders hero immediately and lazy-loads below-the-fold sections", async () => {
    renderWithProviders(<MainLanding />);

    expect(
      screen.getByText(landingTranslations.ar.hero.titleHighlight)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(landingTranslations.ar.journey.title)
      ).toBeInTheDocument();
      expect(
        screen.getByText(landingTranslations.ar.modules.title)
      ).toBeInTheDocument();
      expect(
        screen.getByText(landingTranslations.ar.governance.title)
      ).toBeInTheDocument();
      expect(
        screen.getByText(landingTranslations.ar.impact.title)
      ).toBeInTheDocument();
    });
  });

  test("skips video rendering when prefers-reduced-motion is enabled", async () => {
    setupBrowserMocks(true);

    const { container } = renderWithProviders(<MainLanding />);
    expect(container.querySelector("video")).toBeNull();
  });

  test("DonationJourney3D switches active station cleanly via tabs", () => {
    render(
      <DonationJourney3D
        t={landingTranslations.ar}
        dir="rtl"
        isRTL={true}
      />
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(7);

    fireEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText(landingTranslations.ar.journey.steps[2].title)
    ).toBeInTheDocument();
  });

  test("ModulesCarousel3D filters by category and navigates cleanly", () => {
    render(
      <ModulesCarousel3D
        t={landingTranslations.ar}
        dir="rtl"
        isRTL={true}
        isMobile={false}
      />
    );

    const financeFilter = screen.getByRole("button", {
      name: landingTranslations.ar.modules.categories.finance,
    });
    fireEvent.click(financeFilter);
    expect(financeFilter).toHaveAttribute("aria-pressed", "true");

    const nextBtn = screen.getByRole("button", { name: "Next Module" });
    fireEvent.click(nextBtn);
    expect(screen.getByText("#2")).toBeInTheDocument();
  });

  test("LiveImpactShowcase updates --split-pos via keyboard without re-render errors", () => {
    render(
      <LiveImpactShowcase
        t={landingTranslations.ar}
        dir="rtl"
        reducedMotion={true}
      />
    );

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "55");
    expect(slider.style.getPropertyValue("--split-pos")).toBe("55.00%");
  });
});

