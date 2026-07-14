"use client";
import useCurrentUser from "@/hook/useCurrentUser";
import { useUpdateDepositMutation } from "@/lib/features/updaterApiSlice";
import  { useEffect } from "react";
let hasInitialized = false;
const AutoUpdater = () => {
  const user = useCurrentUser();
  const [updateDepositApi] = useUpdateDepositMutation();
  useEffect(() => {
    if (user) {
      if (hasInitialized) return;
      hasInitialized = true;
      updateDepositApi().unwrap();
    }
  }, [user]);

  return null;
};

export default AutoUpdater;
