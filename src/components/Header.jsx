import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import {
  Search,
  Notifications,
  DarkMode,
  LightMode,
  Menu,
  Person,
} from "@mui/icons-material";
import { toggleMobileMenu } from "../features/uiSlice";
import { useNavigate } from "react-router-dom";
import SearchResultsDialog from "./SearchDialog";
import notificationService from "../service/notificationChatService"

const Header = ({ isDark, onToggleTheme }) => {
  const navigate = useNavigate();
  const name = useSelector((state) => state.auth.name);
  const image = useSelector((state) => state.auth.image);
  const dispatch = useDispatch();
  const location = useLocation();
  const showThemeToggle = typeof onToggleTheme === "function";
  const showGlobalSearch = location.pathname !== "/main-page/patients-records";

  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (value.trim().length >= 1) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  };
  const { data: unreadCount = 0 } =
    notificationService.useGetNotificationCount();

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <header className="sticky top-0 z-5000 w-full border-b theme-border theme-surface-90 backdrop-blur-xl shadow-sm theme-gradient-header">
      <div className="flex items-center gap-3 px-3 py-3 sm:px-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden rounded-xl p-2 theme-hover-surface theme-text-muted transition-colors"
          >
            <Menu fontSize="small" />
          </button>

          <div className="min-w-0 md:hidden">
            <p className="truncate text-sm font-bold theme-text">مركز الشفاء</p>
            <p className="text-[10px] theme-text-muted">لوحة التحكم</p>
          </div>

          {showGlobalSearch && (
            <div className="hidden flex-1 md:block">
              <div ref={searchContainerRef} className="relative max-w-2xl">
                {/* تم تغيير الكلاس هنا: أزلنا shadow-sm القديم وأضفنا focus-within:shadow-lg مع transition */}
                <div className="rounded-2xl p-px theme-gradient-border focus-within:shadow-lg focus-within:shadow-teal-500/20 transition-shadow duration-300">
                  <div className="relative rounded-[15px] theme-surface-90">
                    <input
                      type="search"
                      value={searchText}
                      onChange={handleSearchChange}
                      onFocus={() =>
                        searchText.trim().length >= 2 && setDialogOpen(true)
                      }
                      placeholder="ابحث في النظام..."
                      className="w-full rounded-[15px] border-0 bg-transparent py-2.5 pr-12 pl-4 text-sm theme-text outline-none placeholder:text-(--color-grey)"
                    />
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted"
                      fontSize="small"
                    />
                  </div>
                </div>

                <SearchResultsDialog
                  open={dialogOpen}
                  onClose={handleCloseDialog}
                  query={searchText}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              console.log("تم الضغط على أيقونة الإشعارات!");
              navigate("/main-page/notifications");
            }}
            className="relative rounded-xl p-2 theme-text-muted theme-hover-surface transition-colors cursor-pointer"
            aria-label="الإشعارات"
          >
            <Notifications fontSize="small" />

            {/* عرض الشارة الحمراء فقط إذا كان هناك إشعارات غير مقروءة */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount > 9 ? "+9" : unreadCount}
              </span>
            )}
          </Motion.button>

          {showThemeToggle && (
            <Motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleTheme}
              className="rounded-xl cursor-pointer p-2 theme-text-muted theme-hover-surface transition-colors"
            >
              {isDark ? (
                <LightMode fontSize="small" />
              ) : (
                <DarkMode fontSize="small" />
              )}
            </Motion.button>
          )}

          <Link to={"/main-page/profile"}>
            <div className="hidden items-center gap-3 rounded-2xl border theme-border theme-surface px-3 py-2 shadow-sm sm:flex">
              {/* حاوية الصورة الشخصية أو الأيقونة البديلة */}
              <div className="flex overflow-hidden h-9 w-9 items-center justify-center rounded-xl theme-accent theme-text-on-accent">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Person fontSize="small" />
                )}
              </div>

              {/* تفاصيل الاسم والمسمى الوظيفي */}
              <div className="text-right leading-tight">
                <p className="text-xs font-bold theme-text">
                  {name || "مدير المركز"}
                </p>
                <p className="text-[10px] theme-text-muted">المدير التنفيذي</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {showGlobalSearch && (
        <div className="px-3 pb-3 sm:px-4 md:hidden">
          <div ref={searchContainerRef} className="relative">
            {/* نفس التعديل للموبايل */}
            <div className="rounded-2xl p-px theme-gradient-border focus-within:shadow-lg focus-within:shadow-teal-500/20 transition-shadow duration-300">
              <div className="relative rounded-[15px] theme-surface-90">
                <input
                  type="search"
                  value={searchText}
                  onChange={handleSearchChange}
                  onFocus={() =>
                    searchText.trim().length >= 2 && setDialogOpen(true)
                  }
                  placeholder="ابحث في النظام..."
                  className="w-full rounded-[15px] border-0 bg-transparent py-2.5 pr-12 pl-4 text-sm theme-text outline-none placeholder:text-(--color-grey)"
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted"
                  fontSize="small"
                />
              </div>
            </div>
            <SearchResultsDialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              query={searchText}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
