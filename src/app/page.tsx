"use client";
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { Store } from "@/types/store";
import StoreProfileCard from '../components/StoreProfileCard';
import StoreProfileForm from '../components/StoreProfileForm';
import { StoreProfile, StoreProfileFormData } from '../types/store';
import Link from "next/link";

// Mock data for example store
const mockStore: StoreProfile = {
  id: 'example-1',
  storeName: "Sarah's Artisan Bakery",
  description: "Handcrafted breads, pastries, and cakes made with love. Specializing in sourdough and French pastries. Custom orders welcome for special occasions!",
  logoUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=60",
  location: "123 Baker Street, Downtown",
  phoneNumber: "+1 (555) 123-4567",
  email: "sarah@artisanbakery.com",
  socialLinks: {
    facebook: "https://facebook.com/sarahsartisanbakery",
    instagram: "https://instagram.com/sarahsbakes",
    telegram: "https://t.me/sarahsbakery",
    website: "https://sarahsartisanbakery.com"
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [fetchingStores, setFetchingStores] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    logoUrl: "",
    description: "",
    openingHours: "",
    websiteUrl: "",
    whatsapp: "",
    address: "",
    phone: "",
    email: "",
    locationUrl: "",
    facebook: "",
    instagram: "",
    telegram: "",
    googleReviewUrl: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof addForm | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [newStoreLink, setNewStoreLink] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchStores = async () => {
      setFetchingStores(true);
      const querySnapshot = await getDocs(collection(db, "stores"));
      const storeList: Store[] = [];
      querySnapshot.forEach((docSnap) => {
        storeList.push({ id: docSnap.id, ...docSnap.data() } as Store);
      });
      setStores(storeList);
      setFetchingStores(false);
    };
    fetchStores();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");
    setNewStoreLink(null);
    try {
      const now = Date.now();
      const docRef = await addDoc(collection(db, "stores"), {
        ...addForm,
        createdAt: now,
        updatedAt: now,
      });
      setStores((prev) => [
        { id: docRef.id, ...addForm, createdAt: now, updatedAt: now } as Store,
        ...prev,
      ]);
      setAddForm({
        name: "",
        logoUrl: "",
        description: "",
        openingHours: "",
        websiteUrl: "",
        whatsapp: "",
        address: "",
        phone: "",
        email: "",
        locationUrl: "",
        facebook: "",
        instagram: "",
        telegram: "",
        googleReviewUrl: "",
      });
      setShowAddForm(false);
      setNewStoreLink(`${window.location.origin}/store/${docRef.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    await deleteDoc(doc(db, "stores", id));
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditStore = (store: Store) => {
    setEditId(store.id);
    setEditForm({
      name: store.name || "",
      logoUrl: store.logoUrl || "",
      description: store.description || "",
      openingHours: store.openingHours || "",
      websiteUrl: store.websiteUrl || "",
      whatsapp: store.whatsapp || "",
      address: store.address || "",
      phone: store.phone || "",
      email: store.email || "",
      locationUrl: store.locationUrl || "",
      facebook: store.facebook || "",
      instagram: store.instagram || "",
      telegram: store.telegram || "",
      googleReviewUrl: store.googleReviewUrl || "",
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editForm) return;
    setEditLoading(true);
    setError("");
    try {
      const now = Date.now();
      await updateDoc(doc(db, "stores", editId), {
        ...editForm,
        updatedAt: now,
      });
      setStores((prev) =>
        prev.map((s) =>
          s.id === editId ? { ...s, ...editForm, updatedAt: now } as Store : s
        )
      );
      setEditId(null);
      setEditForm(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm(null);
  };

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-400 p-4 font-sans relative">
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center animate-fade-in border border-white/40">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 shadow-md">
              <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01.88 7.903A5.5 5.5 0 1112 6.5c.341 0 .677.03 1.004.086" /></svg>
            </div>
            <h1 className="text-4xl font-extrabold mb-1 text-blue-900 tracking-tight">Admin Login</h1>
            <p className="text-gray-500 text-center text-base">StoreLink Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full mt-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-lg bg-white/80 text-gray-900 placeholder-gray-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-lg bg-white/80 text-gray-900 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-700 text-white rounded px-4 py-2 font-semibold hover:bg-blue-800 transition text-lg shadow-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
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

  // Admin dashboard after login
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-400 p-4 font-sans relative">
      <div className="absolute inset-0 bg-white/30 pointer-events-none" />
      <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col items-center animate-fade-in border border-white/40">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
            >
              Logout
            </button>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="mb-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-semibold"
          >
            {showAddForm ? "Cancel" : "Add New Store"}
          </button>
          {showAddForm && (
            <form onSubmit={handleAddStore} className="flex flex-col gap-2 bg-white/90 p-4 rounded shadow">
              <input type="text" placeholder="Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" required />
              <input type="text" placeholder="Logo URL" value={addForm.logoUrl} onChange={e => setAddForm(f => ({ ...f, logoUrl: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <textarea placeholder="Description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Opening Hours" value={addForm.openingHours} onChange={e => setAddForm(f => ({ ...f, openingHours: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Website URL" value={addForm.websiteUrl} onChange={e => setAddForm(f => ({ ...f, websiteUrl: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="WhatsApp" value={addForm.whatsapp} onChange={e => setAddForm(f => ({ ...f, whatsapp: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Address" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Phone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="email" placeholder="Email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Location URL (Google Maps)" value={addForm.locationUrl} onChange={e => setAddForm(f => ({ ...f, locationUrl: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Facebook" value={addForm.facebook} onChange={e => setAddForm(f => ({ ...f, facebook: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Instagram" value={addForm.instagram} onChange={e => setAddForm(f => ({ ...f, instagram: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Telegram" value={addForm.telegram} onChange={e => setAddForm(f => ({ ...f, telegram: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <input type="text" placeholder="Google Review URL" value={addForm.googleReviewUrl} onChange={e => setAddForm(f => ({ ...f, googleReviewUrl: e.target.value }))} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
              <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 font-semibold" disabled={addLoading}>{addLoading ? "Adding..." : "Add Store"}</button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          )}
          {newStoreLink && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-2 text-sm text-center">
              Store added! Direct link: <a href={newStoreLink} className="underline break-all" target="_blank" rel="noopener noreferrer">{newStoreLink}</a>
              <br />
              <span className="text-xs">Copy this link to program your NFC tag or QR code.</span>
            </div>
          )}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Stores</h2>
            {fetchingStores ? (
              <p>Loading stores...</p>
            ) : stores.length === 0 ? (
              <p>No stores found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {stores.map((store) => (
                  <li key={store.id} className="py-3 flex flex-col gap-2">
                    {editId === store.id && editForm ? (
                      <form onSubmit={handleEditSave} className="flex flex-col gap-2 bg-white/90 p-3 rounded shadow">
                        <input name="name" type="text" placeholder="Name" value={editForm.name} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" required />
                        <input name="logoUrl" type="text" placeholder="Logo URL" value={editForm.logoUrl} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <textarea name="description" placeholder="Description" value={editForm.description} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="openingHours" type="text" placeholder="Opening Hours" value={editForm.openingHours} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="websiteUrl" type="text" placeholder="Website URL" value={editForm.websiteUrl} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="whatsapp" type="text" placeholder="WhatsApp" value={editForm.whatsapp} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="address" type="text" placeholder="Address" value={editForm.address} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="phone" type="text" placeholder="Phone" value={editForm.phone} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="email" type="email" placeholder="Email" value={editForm.email} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="locationUrl" type="text" placeholder="Location URL (Google Maps)" value={editForm.locationUrl} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="facebook" type="text" placeholder="Facebook" value={editForm.facebook} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="instagram" type="text" placeholder="Instagram" value={editForm.instagram} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="telegram" type="text" placeholder="Telegram" value={editForm.telegram} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <input name="googleReviewUrl" type="text" placeholder="Google Review URL" value={editForm.googleReviewUrl} onChange={handleEditFormChange} className="border border-blue-200 rounded px-3 py-2 text-gray-900 placeholder-gray-500" />
                        <div className="flex gap-2 mt-2">
                          <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 font-semibold" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
                          <button type="button" onClick={handleEditCancel} className="bg-gray-300 rounded px-4 py-2">Cancel</button>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                      </form>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{store.name}</div>
                            <div className="text-xs text-gray-500">ID: {store.id}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditStore(store)}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStore(store.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-blue-700 break-all mt-1">
                          Direct link: <a href={`/store/${store.id}`} className="underline" target="_blank" rel="noopener noreferrer">{`${window.location.origin}/store/${store.id}`}</a>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
