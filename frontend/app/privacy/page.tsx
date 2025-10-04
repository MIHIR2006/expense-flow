import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-3xl">
            <CardHeader className="text-center space-y-4">
              <Button
                asChild
                variant="ghost"
                className="self-start text-purple-400 hover:text-purple-300"
              >
                <Link href="/signup">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign Up
                </Link>
              </Button>
              <CardTitle className="text-3xl font-bold text-white">
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-300">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">5. Cookies and Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website and analyze usage patterns.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
                <p className="mb-4">
                  You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at privacy@company.com
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
