import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/specialties/specialtiesSlice";
import { showSnackbar } from "../../../features/uiSlice";
import { useDeleteSpecialtyMutation } from "../../../service/specialtiesService";

const DeleteConfirmDialog = () => {
  const { isDeleteSheetOpen, itemToDelete } = useSelector(
    (state) => state.specialties,
  );
  const dispatch = useDispatch();

  const deleteSpecialtyMutation = useDeleteSpecialtyMutation({
    onSuccess: () => {
      // يغلق الـ Dialog وتظهر رسالة النجاح فقط عند اكتمال العملية بنجاح
      dispatch(closeDeleteDialog());
      dispatch(
        showSnackbar({
          message: "تم حذف الاختصاص بنجاح",
          variant: "success",
        }),
      );
    },
    onError: () => {
      // يبقى الـ Dialog مفتوحاً وتظهر رسالة الخطأ هنا في حال الفشل
      dispatch(
        showSnackbar({
          message: "تعذر حذف الاختصاص حالياً",
          variant: "error",
        }),
      );
    },
  });

  const handleDelete = () => {
    if (!itemToDelete || deleteSpecialtyMutation.isPending) return;
    // 💡 تم إزالة التسكير المسبق من هنا لضمان بقاء الـ Dialog مفتوحاً حتى انتهاء الاستجابة
    deleteSpecialtyMutation.mutate(itemToDelete);
  };

  if (!isDeleteSheetOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      style={{ zIndex: 10000 }}
    >
      {/* الخلفية المظلمة */}
      <div
        onClick={() => !deleteSpecialtyMutation.isPending && dispatch(closeDeleteDialog())}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />

      {/* صندوق الحوار */}
      <div className="theme-surface p-5 sm:p-8 rounded-3xl max-w-sm w-full relative z-10 text-center shadow-2xl">
        <div className="w-16 h-16 theme-danger-soft theme-text-danger rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          !
        </div>
        
        <h3 className="text-xl font-bold theme-text mb-2">هل أنت متأكد؟</h3>
        <p className="theme-text-muted mb-6 text-sm">
          لا يمكن التراجع عن عملية الحذف بعد إتمامها.
        </p>

        <div className="flex gap-3">
          {/* زر الحذف مع الـ Spinner */}
          <button
            onClick={handleDelete}
            disabled={deleteSpecialtyMutation.isPending}
            className="flex-1 flex cursor-pointer items-center justify-center gap-2 theme-danger-soft theme-text-danger font-bold py-3 rounded-xl theme-hover-danger-solid transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {deleteSpecialtyMutation.isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 theme-text-danger"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    document-dir="rtl"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>جاري الحذف...</span>
              </>
            ) : (
              "حذف"
            )}
          </button>

          {/* زر الإلغاء */}
          <button
            onClick={() => dispatch(closeDeleteDialog())}
            disabled={deleteSpecialtyMutation.isPending}
            className="flex-1 cursor-pointer theme-bg theme-text font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;