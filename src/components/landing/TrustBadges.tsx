import { Shield, Lock, CheckCircle, Building2 } from "lucide-react";

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-medium">Bank-Verified</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-5 w-5 text-primary" />
        <span className="font-medium">256-bit SSL</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-5 w-5 text-primary" />
        <span className="font-medium">SOC 2 Compliant</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-5 w-5 text-primary" />
        <span className="font-medium">Plaid Secured</span>
      </div>
    </div>
  );
};

export default TrustBadges;
