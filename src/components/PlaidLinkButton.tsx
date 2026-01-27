import { useState, useCallback, useEffect, useRef, memo } from "react";
import { usePlaidLink, PlaidLinkOptions } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlaidLinkButtonProps {
  onSuccess: () => void;
}

const PlaidLinkButton = ({ onSuccess }: PlaidLinkButtonProps) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  const fetchLinkToken = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in first");
        return;
      }

      const response = await supabase.functions.invoke("plaid-create-link-token", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error) {
        console.error("Full Edge Function error:", response.error);

        // Try to extract the specific Plaid error message if returned
        let errorMessage = "Failed to initialize bank connection";
        if (typeof response.error === 'object' && response.error !== null) {
          // If the SDK parses the error body into the message or a status property
          errorMessage = response.error.message || errorMessage;
        }

        toast.error(errorMessage);
        return;
      }

      setLinkToken(response.data.link_token);
    } catch (error: any) {
      console.error("Error fetching link token:", error);
      toast.error(error.message || "Failed to initialize bank connection");
    } finally {
      setLoading(false);
    }
  };

  const handleOnSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please log in first");
          return;
        }

        const response = await supabase.functions.invoke("plaid-exchange-token", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: {
            public_token: publicToken,
            institution: metadata.institution,
          },
        });

        if (response.error) {
          throw new Error(response.error.message || "Failed to connect bank");
        }

        toast.success(`Successfully connected ${metadata.institution?.name || "bank account"}!`);

        // Fetch transactions immediately after connecting
        toast.info("Fetching your transactions...");
        const transactionResponse = await supabase.functions.invoke("plaid-get-transactions", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (transactionResponse.error) {
          console.error("Error fetching transactions:", transactionResponse.error);
          toast.error("Bank connected, but failed to fetch transactions. You can refresh manually.");
        } else {
          toast.success("Transactions synced successfully!");
          // Force a hard refresh to clear any auth/cache issues and show fresh data
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }

        onSuccess();
      } catch (error) {
        console.error("Error exchanging token:", error);
        toast.error("Failed to complete bank connection");
      }
    },
    [onSuccess]
  );

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: (err) => {
      if (err) {
        console.error("Plaid Link exit error:", err);
      }
      setLinkToken(null);
      hasInitialized.current = false;
    },
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = async () => {
    if (linkToken && ready) {
      open();
    } else {
      await fetchLinkToken();
    }
  };

  // Auto-open Plaid Link when token is fetched (only once)
  useEffect(() => {
    if (linkToken && ready && !hasInitialized.current) {
      hasInitialized.current = true;
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <Button
      variant="success"
      size="lg"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Building2 className="mr-2 h-5 w-5" />
      )}
      {loading ? "Connecting..." : "Connect Your Bank"}
    </Button>
  );
};

// Memoize component to prevent unnecessary re-renders and script duplication
export default memo(PlaidLinkButton);
