import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate", // تحديث الكاش تلقائياً فور رفع كود جديد
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        start_url: "/", // 👈 أضف هذا السطر
        scope: "/",     // 👈 وأضف هذا السطر
        name: "نظام شفاء لإدارة المراكز الطبية", // الاسم الكامل للتطبيق
        short_name: "شفاء", // الاسم الذي سيظهر تحت أيقونة التطبيق في الشاشة الرئيسية
        description: "منصة متكاملة لإدارة عيادات ومواعيد الأطباء",
        theme_color: "#3b82f6", // لون شريط النظام العلوي (مثلاً أزرق Tailwind)
        background_color: "#ffffff", // لون خلفية شاشة الترحيب (Splash Screen)
        display: "standalone", // يفتح التطبيق في نافذة مستقلة بدون شريط المتصفح
        orientation: "portrait", // توجيه الشاشة الافتراضي (عمودي)
        icons: [
          {
            src: "download.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "download.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "download.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // مهمة جداً لكي تتناسب الأيقونة مع أشكال واجهات الأندرويد المختلفة
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 // 6 MiB
      }
    }),
  ],
})
