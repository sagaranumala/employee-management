'use client';

import { useEffect, useState, FormEvent } from "react";
import * as QRCode from "qrcode.react";
import { useToast } from "@/app/(pages)/components/toast";
import { useAuth } from "@/src/auth/AuthContext";

export default function Enable2FAPage() {
  const { token } = useAuth();
  const toast = useToast();

  const [qrUrl, setQrUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  // Fetch QR code & secret
  useEffect(() => {
    const fetch2FA = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}auth/enable2fa`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to enable 2FA');
        }

        setQrUrl(data.data.qrCodeUrl);
        setSecret(data.data.secret);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Error fetching 2FA QR code');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetch2FA();
  }, [token, toast]);

  // Verify 2FA code
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!code) return toast.error("Enter the 6-digit code");

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}auth/verify2fa`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid 2FA code');
      }

      setVerified(true);
      toast.success("Two-Factor Authentication activated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to verify 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Enable Two-Factor Authentication</h1>

      {loading && <p>Loading...</p>}

      {!loading && qrUrl && !verified && (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4">
          <QRCode.QRCodeCanvas value={qrUrl} size={200} />
          <p className="text-sm text-gray-600 text-center">
            Scan this QR code in your Google Authenticator app
          </p>
          <p className="text-sm text-gray-500 break-all text-center">
            Secret (manual entry if needed): {secret}
          </p>

          <form onSubmit={handleVerify} className="flex flex-col space-y-3 w-full max-w-xs">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
            <button
              type="submit"
              className="py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Verify
            </button>
          </form>
        </div>
      )}

      {verified && (
        <div className="bg-green-50 p-6 rounded-xl shadow-lg text-center">
          <p className="text-green-700 font-semibold">✅ Two-Factor Authentication is now active!</p>
        </div>
      )}
    </div>
  );
}
