"use client";

import dynamic from 'next/dynamic';

const AssetsPlayground = dynamic(
  () => import('@/components/assets-playground/AssetsPlayground').then((mod) => mod.AssetsPlayground),
  { ssr: false }
);

export default AssetsPlayground;
