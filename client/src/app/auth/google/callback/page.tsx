import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../../../lib/api/auth.api";
import PageLoader from "../../../../components/PageLoader";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const finishGoogleLogin = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const status = params.get("status");

        if (status === "failure" || !accessToken) {
          navigate("/login", { replace: true });
          return;
        }

        // ✅ احفظ التوكن
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        // ✅ جلب بيانات المستخدم
        const user = await queryClient.fetchQuery({
          queryKey: ["me"],
          queryFn: authApi.me,
        });

        navigate(
          user.role === "ADMIN"
            ? "/admin"
            : user.role === "TEACHER"
              ? "/teacher"
              : "/dashboard",
          { replace: true },
        );
      } catch {
        navigate("/login", { replace: true });
      }
    };

    finishGoogleLogin();
  }, [navigate, queryClient]);

  return <PageLoader />;
}