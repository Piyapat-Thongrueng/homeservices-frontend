import React from "react";
import OrderCard from "@/features/repairorder/OrderCard";
import type { OrderType } from "@/features/repairorder/types";

export default function OrderCardHistory({
  order,
  onReviewSubmitted,
}: {
  order: OrderType;
  onReviewSubmitted?: () => void;
}) {
  return <OrderCard order={order} onReviewSubmitted={onReviewSubmitted} />;
}
