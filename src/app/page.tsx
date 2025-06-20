"use client";
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { Store } from "@/types/store";
import "./globals.css";

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add store");
      }
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

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 w-full max-w-xs flex flex-col items-center px-6 py-8">
          {/* Brand accent bar */}
          <div className="w-12 h-1.5 rounded-full bg-blue-500 mb-6 mt-1" />
          <h1 className="text-2xl font-bold mb-1 text-blue-900 tracking-tight text-center">Admin Login</h1>
          <p className="text-gray-500 text-center text-sm mb-6">StoreLink Admin Panel</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-red-500 text-xs text-center font-medium mt-1 w-full">{error}</p>}
          </form>
        </div>
      </main>
    );
  }

  // Admin dashboard after login
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 p-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-12 h-1.5 rounded-full bg-blue-500 mb-2" />
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 text-base">Manage your stores</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* Add Store Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 font-bold text-base transition"
          >
            <span className="text-xl">＋</span> {showAddForm ? "Cancel" : "Add Store"}
          </button>
        </div>

        {/* Add Store Form */}
        {showAddForm && (
          <form onSubmit={handleAddStore} className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow mb-6 border border-blue-100">
            <input type="text" placeholder="Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" required />
            <input type="text" placeholder="Logo URL" value={addForm.logoUrl} onChange={e => setAddForm(f => ({ ...f, logoUrl: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <textarea placeholder="Description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Opening Hours" value={addForm.openingHours} onChange={e => setAddForm(f => ({ ...f, openingHours: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Website URL" value={addForm.websiteUrl} onChange={e => setAddForm(f => ({ ...f, websiteUrl: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="WhatsApp" value={addForm.whatsapp} onChange={e => setAddForm(f => ({ ...f, whatsapp: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Address" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Phone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="email" placeholder="Email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Location URL (Google Maps)" value={addForm.locationUrl} onChange={e => setAddForm(f => ({ ...f, locationUrl: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Facebook" value={addForm.facebook} onChange={e => setAddForm(f => ({ ...f, facebook: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Instagram" value={addForm.instagram} onChange={e => setAddForm(f => ({ ...f, instagram: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Telegram" value={addForm.telegram} onChange={e => setAddForm(f => ({ ...f, telegram: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Google Review URL" value={addForm.googleReviewUrl} onChange={e => setAddForm(f => ({ ...f, googleReviewUrl: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
            <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 font-semibold mt-2" disabled={addLoading}>{addLoading ? "Adding..." : "Add Store"}</button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </form>
        )}
        {newStoreLink && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-2 text-sm text-center mb-4">
            Store added! Direct link: <a href={newStoreLink} className="underline break-all" target="_blank" rel="noopener noreferrer">{newStoreLink}</a>
            <br />
            <span className="text-xs">Copy this link to program your NFC tag or QR code.</span>
          </div>
        )}

        {/* Store List */}
        <h2 className="text-2xl font-bold text-blue-900 mb-4 mt-8">Stores</h2>
        {fetchingStores ? (
          <p className="text-blue-700">Loading stores...</p>
        ) : stores.length === 0 ? (
          <p className="text-gray-500">No stores found.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {stores.map((store) => (
              <li key={store.id} className="flex items-stretch bg-white rounded-xl shadow border-l-4 border-blue-400 hover:shadow-lg transition overflow-hidden">
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-semibold text-lg text-gray-900">{store.name}</span>
                  </div>
                  <div className="text-gray-600 text-sm mb-1 truncate">{store.description}</div>
                  <div className="text-xs text-blue-700 break-all">Direct link: <a href={`/store/${store.id}`} className="underline" target="_blank" rel="noopener noreferrer">{`${window.location.origin}/store/${store.id}`}</a></div>
                </div>
                <div className="flex flex-col justify-center gap-2 p-2">
                  <button
                    onClick={() => handleEditStore(store)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
