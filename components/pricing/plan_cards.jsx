"use client";

import Link from "next/link";
import { Crown, Diamond, HardDrive, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Starter",
    price: "2.99",
    description: "Perfect for passion projects & simple websites",
    icon: Zap,
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "4.99",
    description: "Most Popular - For production applications with the power to scale",
    icon: Crown,
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "9.99",
    description: "For large teams with advanced collaboration needs",
    icon: Diamond,
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale applications with dedicated support",
    icon: Diamond,
    cta: "Contact Sales",
    popular: false,
  },
];

const storageAddons = [
  {
    name: "Storage 50",
    storage: "50 GB extra",
    monthlyPrice: 5,
    highlight: false,
  },
  {
    name: "Storage 200",
    storage: "200 GB extra",
    monthlyPrice: 15,
    highlight: true,
  },
  {
    name: "Storage 500",
    storage: "500 GB extra",
    monthlyPrice: 29,
    highlight: false,
  },
  {
    name: "Storage 1 TB",
    storage: "1 TB extra",
    monthlyPrice: 49,
    highlight: false,
  },
];

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function PlanPrice({ price, yearly }) {
  const numericPrice = Number(price);
  const isNumeric = Number.isFinite(numericPrice);

  if (!isNumeric) {
    return <div className="text-2xl font-bold text-[#e7e7e7]">Custom</div>;
  }

  if (yearly) {
    const yearlyTotal = numericPrice * 10;
    return (
      <>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#e7e7e7]">{formatUsd(yearlyTotal)}</span>
          <span className="text-sm text-[#737373]">/year</span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-400">2 months free with annual billing</p>
      </>
    );
  }

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-[#e7e7e7]">{formatUsd(numericPrice)}</span>
      <span className="text-sm text-[#737373]">/month</span>
    </div>
  );
}

export function PlanCards({ ctaHref }) {
  const [isYearly, setIsYearly] = useState(false);
  const billingLabel = useMemo(() => (isYearly ? "Yearly billing" : "Monthly billing"), [isYearly]);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <span className={`text-sm ${!isYearly ? "text-zinc-100" : "text-zinc-500"}`}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} aria-label="Toggle yearly billing" />
        <span className={`text-sm ${isYearly ? "text-zinc-100" : "text-zinc-500"}`}>Yearly</span>
        <Badge variant="success" className="border border-emerald-500/20 bg-emerald-500/10">
          2 months free
        </Badge>
        <span className="text-xs text-zinc-500">{billingLabel}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-16 md:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <div key={index} className={`relative group ${index === 1 ? "lg:-mt-4 lg:mb-4" : ""}`}>
              <div
                className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] border rounded-2xl overflow-hidden transition-all duration-300 ${
                  plan.popular ? "border-zinc-500 shadow-2xl shadow-zinc-500/20" : "border-[#333333] hover:border-[#474747]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 px-4 text-xs font-semibold text-center bg-gradient-to-r from-zinc-500/20 via-purple-500/20 to-emerald-500/20 border-b border-zinc-500/30 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                )}

                <div className={`pt-8 pb-6 px-6 ${plan.popular ? "pt-12" : ""}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#e7e7e7]">{plan.name}</h3>
                    <Icon className={`w-5 h-5 ${plan.popular ? "text-zinc-400" : "text-[#737373]"}`} />
                  </div>

                  <div className="mb-3">
                    <PlanPrice price={plan.price} yearly={isYearly} />
                  </div>

                  <p className="text-xs text-[#a3a3a3] mb-6 leading-relaxed min-h-[32px]">
                    {plan.description.split(" - ")[1] || plan.description}
                  </p>

                  <Link
                    href={ctaHref}
                    className={`block w-full text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      plan.popular
                        ? "bg-[#474747] hover:bg-[#5a5a5a] text-[#e7e7e7] shadow-lg"
                        : "bg-[#2a2a2a] hover:bg-[#333333] text-[#a3a3a3]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-16 rounded-2xl border border-[#333333] bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#e7e7e7]">Extra Storage Add-ons</h3>
            <p className="text-sm text-[#a3a3a3]">Scale storage independently as your team and media library grow.</p>
          </div>
          <Badge variant="outline" className="w-fit border-[#474747] text-[#a3a3a3]">
            Add-on pricing
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storageAddons.map((addon) => {
            const billingAmount = isYearly ? addon.monthlyPrice * 10 : addon.monthlyPrice;
            return (
              <div
                key={addon.name}
                className={`rounded-xl border p-4 transition-all ${
                  addon.highlight
                    ? "border-zinc-500 bg-zinc-500/5 shadow-[0_0_40px_-24px_rgba(161,161,170,0.45)]"
                    : "border-[#333333] bg-[#181818]"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3a3a3a] bg-[#222222]">
                      <HardDrive className="h-4 w-4 text-[#a3a3a3]" />
                    </div>
                    <p className="text-sm font-semibold text-[#e7e7e7]">{addon.name}</p>
                  </div>
                  {addon.highlight && <Badge variant="secondary">Best value</Badge>}
                </div>

                <p className="mb-4 text-xs text-[#a3a3a3]">{addon.storage}</p>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#e7e7e7]">{formatUsd(billingAmount)}</span>
                    <span className="text-xs text-[#737373]">{isYearly ? "/year" : "/month"}</span>
                  </div>
                  {isYearly && <p className="mt-1 text-[11px] text-emerald-400">2 months free on annual add-on</p>}
                </div>

                <Button
                  asChild
                  className="w-full bg-[#2a2a2a] text-[#e7e7e7] hover:bg-[#333333]"
                >
                  <Link href={ctaHref}>Add Storage</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
