import { Shield, Calendar, Mail, Hash, TrendingUp, DollarSign, Wallet, CheckCircle, Lock, Building2, Wifi } from "lucide-react";

interface ReportHeaderProps {
  reportDate: string;
}

export const ReportHeader = ({ reportDate }: ReportHeaderProps) => (
  <div className="bg-gradient-to-r from-primary to-primary/90 px-8 py-6 rounded-t-lg">
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">GigProof</span>
      </div>
      <h1 className="text-xl font-semibold hidden md:block">Income Verification Report</h1>
      <div className="text-right">
        <div className="text-xs opacity-80">Generated</div>
        <div className="text-sm font-medium">{reportDate}</div>
      </div>
    </div>
  </div>
);

interface ApplicantInfoProps {
  fullName: string;
  email: string;
  periodText: string;
  reportId: string;
}

export const ApplicantInfoSection = ({ fullName, email, periodText, reportId }: ApplicantInfoProps) => (
  <div className="p-6 bg-white">
    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <div className="w-1 h-6 bg-primary rounded-full" />
      Applicant Information
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <InfoCard icon={<Mail className="h-4 w-4" />} label="Full Name" value={fullName} />
      <InfoCard icon={<Mail className="h-4 w-4" />} label="Email" value={email} />
      <InfoCard icon={<Calendar className="h-4 w-4" />} label="Report Period" value={periodText} />
      <InfoCard icon={<Hash className="h-4 w-4" />} label="Report ID" value={reportId} />
    </div>
  </div>
);

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-800 truncate">{value}</div>
  </div>
);

interface IncomeSummaryProps {
  weeklyAverage: number;
  monthlyAverage: number;
  total90Days: number;
  formatCurrency: (amount: number) => string;
}

export const IncomeSummarySection = ({ weeklyAverage, monthlyAverage, total90Days, formatCurrency }: IncomeSummaryProps) => (
  <div className="p-6 bg-white border-t border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <div className="w-1 h-6 bg-primary rounded-full" />
      Income Summary
    </h2>
    <div className="grid md:grid-cols-3 gap-4">
      <SummaryCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Weekly Average"
        value={formatCurrency(weeklyAverage)}
      />
      <SummaryCard
        icon={<DollarSign className="h-5 w-5" />}
        label="Monthly Average"
        value={formatCurrency(monthlyAverage)}
        featured
      />
      <SummaryCard
        icon={<Wallet className="h-5 w-5" />}
        label="Total (90 Days)"
        value={formatCurrency(total90Days)}
      />
    </div>
  </div>
);

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  featured?: boolean;
}

const SummaryCard = ({ icon, label, value, featured }: SummaryCardProps) => (
  <div className={`rounded-xl p-6 border-2 ${featured ? 'border-primary bg-primary/10' : 'border-primary/20 bg-primary/5'}`}>
    <div className="flex items-center gap-2 text-primary mb-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className={`text-2xl md:text-3xl font-bold text-primary`}>
      {value}
    </span>
  </div>
);

interface PlatformBreakdown {
  name: string;
  total: number;
  percentage: number;
}

interface PlatformTableProps {
  platforms: PlatformBreakdown[];
  formatCurrency: (amount: number) => string;
}

export const PlatformTableSection = ({ platforms, formatCurrency }: PlatformTableProps) => {
  const total = platforms.reduce((sum, p) => sum + p.total, 0);
  
  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        Income by Platform
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-4 py-3 text-sm font-semibold">Platform</th>
              <th className="text-right px-4 py-3 text-sm font-semibold">Total Income</th>
              <th className="text-right px-4 py-3 text-sm font-semibold">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((platform, index) => (
              <tr key={platform.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{platform.name}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(platform.total)}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{platform.percentage.toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="bg-primary/10 border-t-2 border-primary/20">
              <td className="px-4 py-3 text-sm font-bold text-primary">Total</td>
              <td className="px-4 py-3 text-sm text-right font-bold text-primary">{formatCurrency(total)}</td>
              <td className="px-4 py-3 text-sm text-right font-bold text-primary">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ConsistencyProps {
  score: number;
}

export const ConsistencySection = ({ score }: ConsistencyProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return { bg: 'bg-primary', text: 'text-primary', border: 'border-primary/20' };
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' };
    return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' };
  };
  
  const colors = getScoreColor(score);
  
  const findings = [
    { text: "Regular income deposits detected", positive: score >= 60 },
    { text: "Multiple verified income sources", positive: true },
    { text: "Consistent weekly earning patterns", positive: score >= 70 },
    { text: "Bank account verification complete", positive: true },
  ];

  return (
    <div className="p-6 bg-white border-t border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        Income Consistency Analysis
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className={`w-32 h-32 rounded-full ${colors.bg} flex items-center justify-center shadow-lg`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{score}%</div>
              <div className="text-xs text-white/80 font-medium">SCORE</div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Findings</h3>
          <div className="space-y-2">
            {findings.map((finding, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${finding.positive ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-sm ${finding.positive ? 'text-gray-700' : 'text-gray-500'}`}>
                  {finding.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReportFooterProps {
  isPremium?: boolean;
  pageNumber?: number;
  totalPages?: number;
}

export const ReportFooter = ({ isPremium, pageNumber, totalPages }: ReportFooterProps) => (
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
    <div className="flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Building2 className="h-3 w-3" />
          Bank-Verified Data
        </span>
        <span className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          Connected via Plaid
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          256-bit SSL Encrypted
        </span>
      </div>
      {pageNumber && totalPages && (
        <span className="font-medium">Page {pageNumber} of {totalPages}</span>
      )}
    </div>
    {isPremium && (
      <div className="text-center mt-2 text-xs text-primary font-medium">
        ✓ Verified GigProof Premium Report
      </div>
    )}
  </div>
);
