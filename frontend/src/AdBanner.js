import { useEffect, useState, useRef } from "react";

const AdBanner = () => {
  const [loading, setLoading] = useState(true);
  const adRef = useRef(null);

  useEffect(() => {
    // AdSense script’ini bir gezek goş
    if (!document.querySelector("script[src*='adsbygoogle.js']")) {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7549160788448307";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense ýüklenmedi:", e);
    }

    // Observer: diňe içi dolananda ýazygy gizlet
    const observer = new MutationObserver(() => {
      if (
        adRef.current &&
        adRef.current.innerHTML.trim() !== "" &&
        !/^\s*$/.test(adRef.current.innerText)
      ) {
        setLoading(false); // diňe hakyky mazmun bar bolsa
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ textAlign: "center", minHeight: "100px", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            color: "gray",
            fontSize: "14px",
          }}
        >
          Ad loading...
        </div>
      )}

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7549160788448307"
        data-ad-slot="3099647840"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;