import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface Notification {
  id: number;
  order_id: number | null;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const useNotification = (userId: number | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications จาก API
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications`);
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch {
      console.error("Failed to fetch notifications");
    }
  }, [userId]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    try {
      await axios.patch(`${API_URL}/api/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      console.error("Failed to mark as read");
    }
  }, [userId]);

  // โหลดครั้งแรก
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Supabase Realtime
  // Subscribe การเปลี่ยนแปลงใน notifications table
  // เมื่อมี INSERT ใหม่ที่ user_id ตรงกับลูกค้าคนนี้
  // → เพิ่ม notification เข้า state ทันที ไม่ต้อง refresh
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT", // ฟัง event INSERT เท่านั้น
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`, // กรองเฉพาะ notification ของ user นี้
        },
        (payload) => {
          // payload.new คือ row ที่เพิ่งถูก INSERT
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        },
      )
      .subscribe((status) => {
      });

    // cleanup: unsubscribe เมื่อ component unmount หรือ userId เปลี่ยน
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, unreadCount, markAllAsRead, fetchNotifications };
};
