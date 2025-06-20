"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Store } from "@/types/store";

export default function StorePage() {
  const params = useParams();
  const storeId = params?.id as string;
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    const fetchStore = async () => {
      setLoading(true);
      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStore(docSnap.data() as Store);
      }
      setLoading(false);
    };
    fetchStore();
  }, [storeId]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
        <p className="text-blue-900 text-lg font-semibold animate-pulse">Loading...</p>
      </main>
    );
  }

  if (!store) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
        <p className="text-red-600 text-lg font-semibold">Store not found.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
      <div className="w-full max-w-sm bg-white/90 rounded-2xl shadow-2xl p-6 flex flex-col items-center animate-fade-in border border-white/40 mt-8 mb-8">
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt={store.name + " logo"}
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-200 shadow"
          />
        )}
        <h1 className="text-2xl font-extrabold text-blue-900 mb-1 text-center">{store.name}</h1>
        {store.description && <p className="mb-2 text-center text-gray-700 text-base">{store.description}</p>}
        {store.openingHours && (
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-blue-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
            <span>{store.openingHours}</span>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3 mt-4 mb-2 w-full">
          {store.phone && (
            <a href={`tel:${store.phone}`} className="flex flex-col items-center text-blue-700 hover:text-blue-900">
              <span className="bg-blue-100 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </span>
              <span className="text-xs">Call</span>
            </a>
          )}
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-green-600 hover:text-green-800">
              <span className="bg-green-100 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.04 2.81 1.19 3 .15.19 2.05 3.13 5.01 4.27.7.24 1.24.38 1.67.48.7.15 1.34.13 1.85.08.56-.06 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" /></svg>
              </span>
              <span className="text-xs">WhatsApp</span>
            </a>
          )}
          {store.email && (
            <a href={`mailto:${store.email}`} className="flex flex-col items-center text-purple-700 hover:text-purple-900">
              <span className="bg-purple-100 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm8 0a12 12 0 11-24 0 12 12 0 0124 0z" /></svg>
              </span>
              <span className="text-xs">Email</span>
            </a>
          )}
          {store.websiteUrl && (
            <a href={store.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-blue-500 hover:text-blue-700">
              <span className="bg-blue-100 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </span>
              <span className="text-xs">Website</span>
            </a>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-2 w-full">
          {store.facebook && (
            <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-blue-600 hover:text-blue-800">
              <span className="bg-blue-100 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
              </span>
              <span className="text-xs">Facebook</span>
            </a>
          )}
          {store.instagram && (
            <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-pink-500 hover:text-pink-700">
              <span className="bg-pink-100 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
              </span>
              <span className="text-xs">Instagram</span>
            </a>
          )}
          {store.telegram && (
            <a href={store.telegram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-blue-400 hover:text-blue-600">
              <span className="bg-blue-50 p-3 rounded-full shadow-md mb-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.05 2.927a2.25 2.25 0 0 0-2.2-.287L3.6 8.13a2.25 2.25 0 0 0 .09 4.23l3.7 1.13 2.13 6.36a2.25 2.25 0 0 0 4.13.13l2.13-4.26 3.7 1.13a2.25 2.25 0 0 0 2.9-2.06V5.177a2.25 2.25 0 0 0-1.35-2.25z"/></svg>
              </span>
              <span className="text-xs">Telegram</span>
            </a>
          )}
        </div>
        {store.address && (
          <div className="flex items-center gap-2 text-gray-700 text-sm mb-2 mt-2">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
            <span>{store.address}</span>
          </div>
        )}
        {store.locationUrl && (
          <a href={store.locationUrl} target="_blank" rel="noopener noreferrer" className="w-full mt-2 mb-2 bg-blue-600 text-white rounded-lg px-4 py-3 text-center font-semibold shadow hover:bg-blue-700 transition text-base">
            Open in Google Maps
          </a>
        )}
        {store.googleReviewUrl && (
          <a href={store.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="w-full mt-2 mb-2 bg-yellow-400 text-yellow-900 rounded-lg px-4 py-3 text-center font-semibold shadow hover:bg-yellow-500 transition text-base">
            Google Reviews
          </a>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </main>
  );
} 