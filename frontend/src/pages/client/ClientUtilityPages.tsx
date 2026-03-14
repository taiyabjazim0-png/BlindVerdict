import { useState } from "react";
import { Card } from "@/components/Card";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useClientProfileStore } from "@/features/useClientProfileStore";
import { PasswordInput } from "@/components/PasswordInput";

export function ClientProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useClientProfileStore((s) => s.profile);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    alert("Password change requested. Backend integration can be added.");
    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Your registration details (read-only except password)</p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-medium text-slate-700">Basic information</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-slate-900">{profile?.name || user?.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{profile?.email || "—"}</dd>
              </div>
              {profile?.dob && (
                <div>
                  <dt className="text-slate-500">Date of birth</dt>
                  <dd className="font-medium text-slate-900">{profile.dob}</dd>
                </div>
              )}
              {profile?.gender && (
                <div>
                  <dt className="text-slate-500">Gender</dt>
                  <dd className="font-medium text-slate-900">{profile.gender}</dd>
                </div>
              )}
              {profile?.mobile && (
                <div>
                  <dt className="text-slate-500">Mobile</dt>
                  <dd className="font-medium text-slate-900">{profile.mobile}</dd>
                </div>
              )}
            </dl>
          </div>

          {profile && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-medium text-slate-700">Verification</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {profile.pan_uploaded && <li>PAN card uploaded</li>}
                {profile.aadhar_uploaded && <li>Aadhar card uploaded</li>}
                {profile.selfie_uploaded && <li>Selfie verification completed</li>}
                {profile.address_verified && <li>Address verification completed</li>}
              </ul>
            </div>
          )}

          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium"
            >
              Change password
            </button>

            {showChangePassword && (
              <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <PasswordInput
                  label="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <PasswordInput
                  label="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <PasswordInput
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    Update password
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
