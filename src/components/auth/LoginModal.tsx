"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";

interface LoginModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback fired when the modal should close
   */
  onClose: () => void;
}

/**
 * Login Modal Component
 * 
 * Modal dialog that wraps the LoginForm component.
 * Automatically closes on successful login.
 * 
 * @example
 * ```tsx
 * const [loginOpen, setLoginOpen] = useState(false);
 * 
 * <LoginModal 
 *   open={loginOpen} 
 *   onClose={() => setLoginOpen(false)} 
 * />
 * ```
 */
export function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Sign in to your account
          </DialogDescription>
        </DialogHeader>
        
        <LoginForm 
          onSuccess={() => {
            // Close modal on successful login
            // The AuthContext will handle the redirect to dashboard
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
