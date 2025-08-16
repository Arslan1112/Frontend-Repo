import { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    // AdSense script’ini ekle (sadece bir kez)
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7549160788448307";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // Reklam alanını çalıştır
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: "block" }}
         data-ad-client="ca-pub-7549160788448307"
         data-ad-slot="3099647840"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
};

export default AdBanner;