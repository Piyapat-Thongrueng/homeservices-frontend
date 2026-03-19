import React from "react";
import OrderCard from "@/features/repairorder/OrderCard";
import type { OrderType } from "@/features/repairorder/types";

export default function OrderCardOrders({ order }: { order: OrderType }) {
  return <OrderCard order={order} />;
}
