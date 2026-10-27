"use client";

// Subpath imports, not the barrel: keeps @geiger/ui's optional peers out of the graph.
import { SuiteHeader } from "@geiger/ui/suite-header";
import { SUITE_PRODUCTS } from "@geiger/ui/suite-mega-menu";
import { FileSignature, MessagesSquare } from "lucide-react";

// Dash lists Comms and Docs in the Products menu even though geiger-ui's default list dropped them; they slot in just before Property.
const COMMS_AND_DOCS = [
  { icon: MessagesSquare, label: "Comms", description: "Live chat and customer support.", href: "/comms" },
  { icon: FileSignature, label: "Docs", description: "Send and sign documents.", href: "/docs" },
];

// Filter first so a future geiger-ui that re-adds them doesn't list them twice.
const baseProducts = SUITE_PRODUCTS.filter((item) => !COMMS_AND_DOCS.some((extra) => extra.href === item.href));
const propertyIndex = baseProducts.findIndex((item) => item.href === "/property");
const insertAt = propertyIndex === -1 ? baseProducts.length : propertyIndex;
const DASH_PRODUCTS = [...baseProducts.slice(0, insertAt), ...COMMS_AND_DOCS, ...baseProducts.slice(insertAt)];

// Client boundary for the shared header: product icons are components, so the list can't cross from the server <Header /> as a prop.
export function DashSuiteHeader(props) {
  return <SuiteHeader products={DASH_PRODUCTS} {...props} />;
}
