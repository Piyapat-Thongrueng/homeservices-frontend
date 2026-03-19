import React from "react";
import OrderCard from "@/components/repairorder/OrderCard";
import type { OrderType } from "@/components/repairorder/types";

export default function OrderCardOrders({ order }: { order: OrderType }) {
  return <OrderCard order={order} />;
}
