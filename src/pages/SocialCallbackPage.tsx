import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { AuthManager, User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SocialCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAppStore();
    const { toast } = useToast();

    useEffect(() => {
        const token = searchParams.get("token");
        const userData = searchParams.get("user");

        if (token && userData) {
            try {
                const user = JSON.parse(decodeURIComponent(userData)) as User;

                // Save to AuthManager and Store
                AuthManager.setToken(token);
                setUser(user);

                toast({
                    title: "Welcome!",
                    description: "You've successfully signed in with your social account.",
                });

                // Small delay to ensure state is committed
                setTimeout(() => {
                    navigate("/dashboard");
                }, 100);
            } catch (err) {
                console.error("Failed to parse user data", err);
                toast({
                    title: "Authentication Error",
                    description: "We couldn't process your login information. Please try again.",
                    variant: "destructive",
                });
                navigate("/login");
            }
        } else {
            const error = searchParams.get("error");
            if (error) {
                toast({
                    title: "Login Failed",
                    description: "The social login process was interrupted or failed.",
                    variant: "destructive",
                });
            }
            navigate("/login");
        }
    }, [searchParams, navigate, setUser, toast]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <h1 className="text-2xl font-bold">Completing sign in...</h1>
                <p className="text-muted-foreground italic">Syncing your account details politely.</p>
            </div>
        </div>
    );
}
