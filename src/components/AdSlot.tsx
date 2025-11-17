import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type AdSlotProps = {
  adClient: string;
  adSlot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
};

export function AdSlot({
  adClient,
  adSlot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.warn("AdSense error:", e);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        ref={adRef as any}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
