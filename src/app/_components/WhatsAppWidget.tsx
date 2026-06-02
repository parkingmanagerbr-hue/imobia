"use client";

import { useState } from "react";

interface WhatsAppWidgetProps {
  businessName?: string;
  greeting?: string;
  phone?: string;
}

export function WhatsAppWidget({
  businessName = "ImobIA",
  greeting = "Olá! Como posso ajudar você hoje?",
  phone = "5519982103949",
}: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const text = message.trim() || greeting;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const WA_SVG = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 60, height: 60, borderRadius: "50%",
          backgroundColor: "#25D366", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(37,211,102,0.45)",
          transition: "transform 0.2s",
        }}
        aria-label="Falar pelo WhatsApp"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : WA_SVG}
      </button>

      {/* Popup */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 24, zIndex: 9999,
          width: 320, borderRadius: 16, overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          animation: "waFadeIn 0.2s ease",
        }}>
          <style>{`@keyframes waFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Header */}
          <div style={{ background: "#075E54", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: "#25D366",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: "white", flexShrink: 0,
            }}>
              {businessName[0]}
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{businessName}</div>
              <div style={{ color: "#a8edcc", fontSize: 12 }}>● Online agora</div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ background: "#e5ddd5", padding: "16px 12px", minHeight: 140 }}>
            <div style={{
              background: "white", borderRadius: "0 10px 10px 10px",
              padding: "10px 14px", maxWidth: "88%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
              fontSize: 14, color: "#111", lineHeight: 1.5,
            }}>
              {greeting}
              <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 4 }}>
                {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ background: "#f0f2f5", padding: "8px 10px", display: "flex", gap: 8, alignItems: "center" }}>
            <input
              autoFocus
              type="text"
              placeholder="Digite uma mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1, borderRadius: 20, border: "none",
                padding: "10px 16px", fontSize: 14, outline: "none",
                background: "white", color: "#111",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#25D366", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Enviar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
