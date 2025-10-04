import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-300">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
                <p className="mb-4">
                  Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">3. Disclaimer</h2>
                <p className="mb-4">
                  The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">4. Limitations</h2>
                <p className="mb-4">
                  In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">5. Privacy Policy</h2>
                <p className="mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
                </p>

                <h2 className="text-xl font-semibold text-white mb-4">6. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us at legal@company.com
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
