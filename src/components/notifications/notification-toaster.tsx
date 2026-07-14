// components/notification-toaster.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { deleteNotification, markAsRead } from "@/action/notifications";

export function NotificationToaster({ userId }: { userId: string }) {
  const router = useRouter();

  const onShow = (notification: any) => {
    markAsRead(notification.id);
  };

  const onManualClose = (notification: any) => {
    deleteNotification(notification.id);
  };

  useEffect(() => {
    const createContainer = () => {
      const container = document.createElement("div");
      container.id = "notification-container";
      container.className = `
        fixed top-8 right-4
        space-y-3
        z-50
        w-full max-w-xs
      `;
      document.body.appendChild(container);
      return container;
    };

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind("new-notification", (notification: any) => {
      const toastId = `toast-${Date.now()}`;
      const toastElement = document.createElement("div");
      toastElement.id = toastId;
      toastElement.className = `
        notification-toast
        bg-[#ffffff] !opacity-[0.90] dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-md shadow-lg
        px-4
        py-2
        cursor-pointer
        transform transition-all duration-300
        animate-in slide-in-from-right-8
        hover:shadow-xl
        relative
        overflow-hidden
      `;

      // Add progress bar
      const progressBar = document.createElement("div");
      progressBar.className = `
        absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20
        origin-left
        animate-progress
      `;
      progressBar.style.animationDuration = "5000ms";

      toastElement.innerHTML = `
        <div class="flex items-center gap-2 relative py-1">
          <div class="w-1 h-[50px] bg-blue-500 rounded-sm"></div>
          <div class="w-5 h-5 rounded-full flex justify-center items-center bg-blue-500 text-white">
          i</div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm text-gray-900 dark:text-white">
              New Message
            </h4>
            ${
              notification.description
                ? `
              <p class="text-xs text-gray-600 dark:text-gray-300  line-clamp-1">
                ${notification.description}
              </p>
            `
                : ""
            }


          </div>
         <button class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 self-start mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
          
        </div>
      `;

      toastElement.appendChild(progressBar);

      // Add close button functionality
      const closeButton = toastElement.querySelector("button");
      closeButton?.addEventListener("click", (e) => {
        e.stopPropagation();
        dismissToast(toastElement, true);
      });

      // Add click handler
      toastElement.addEventListener("click", () => {
        router.push(`/notifications?id=${notification.id}`);
        dismissToast(toastElement);
      });

      // Add to container
      const container =
        document.getElementById("notification-container") || createContainer();
      container.prepend(toastElement);
      onShow(notification);

      // Auto-dismiss after 5 seconds
      const timeoutId = setTimeout(() => {
        dismissToast(toastElement);
      }, 5000);

      // Store timeout ID for cleanup
      toastElement.dataset.timeoutId = timeoutId.toString();

      const dismissToast = (toastElement: HTMLElement, manual = false) => {
        if (manual) onManualClose(notification);
        toastElement.classList.add(
          "animate-out",
          "fade-out",
          "slide-out-to-right-8",
        );
        toastElement.addEventListener("animationend", () => {
          const timeoutId = toastElement.dataset.timeoutId;
          if (timeoutId) clearTimeout(parseInt(timeoutId));
          toastElement.remove();
        });
      };
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      // Clean up any remaining toasts
      document.getElementById("notification-container")?.remove();
    };
  }, [userId, router]);

  return null;
}
