"use client";
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { Store } from "@/types/store";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function AdminPage() {
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

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch stores
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

  if (user) {
    return (
      <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showAddForm ? "Cancel" : "Add New Store"}
          </button>
          {showAddForm && (
            <form onSubmit={handleAddStore} className="flex flex-col gap-2 bg-white p-4 rounded shadow">
              <input type="text" placeholder="Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="border rounded px-3 py-2" required />
              <input type="text" placeholder="Logo URL" value={addForm.logoUrl} onChange={e => setAddForm(f => ({ ...f, logoUrl: e.target.value }))} className="border rounded px-3 py-2" />
              <textarea placeholder="Description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Opening Hours" value={addForm.openingHours} onChange={e => setAddForm(f => ({ ...f, openingHours: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Website URL" value={addForm.websiteUrl} onChange={e => setAddForm(f => ({ ...f, websiteUrl: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="WhatsApp" value={addForm.whatsapp} onChange={e => setAddForm(f => ({ ...f, whatsapp: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Address" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Phone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="email" placeholder="Email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Location URL (Google Maps)" value={addForm.locationUrl} onChange={e => setAddForm(f => ({ ...f, locationUrl: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Facebook" value={addForm.facebook} onChange={e => setAddForm(f => ({ ...f, facebook: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Instagram" value={addForm.instagram} onChange={e => setAddForm(f => ({ ...f, instagram: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Telegram" value={addForm.telegram} onChange={e => setAddForm(f => ({ ...f, telegram: e.target.value }))} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Google Review URL" value={addForm.googleReviewUrl} onChange={e => setAddForm(f => ({ ...f, googleReviewUrl: e.target.value }))} className="border rounded px-3 py-2" />
              <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700" disabled={addLoading}>{addLoading ? "Adding..." : "Add Store"}</button>
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
                      <form onSubmit={handleEditSave} className="flex flex-col gap-2 bg-white p-3 rounded shadow">
                        <input name="name" type="text" placeholder="Name" value={editForm.name} onChange={handleEditFormChange} className="border rounded px-3 py-2" required />
                        <input name="logoUrl" type="text" placeholder="Logo URL" value={editForm.logoUrl} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <textarea name="description" placeholder="Description" value={editForm.description} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="openingHours" type="text" placeholder="Opening Hours" value={editForm.openingHours} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="websiteUrl" type="text" placeholder="Website URL" value={editForm.websiteUrl} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="whatsapp" type="text" placeholder="WhatsApp" value={editForm.whatsapp} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="address" type="text" placeholder="Address" value={editForm.address} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="phone" type="text" placeholder="Phone" value={editForm.phone} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="email" type="email" placeholder="Email" value={editForm.email} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="locationUrl" type="text" placeholder="Location URL (Google Maps)" value={editForm.locationUrl} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="facebook" type="text" placeholder="Facebook" value={editForm.facebook} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="instagram" type="text" placeholder="Instagram" value={editForm.instagram} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="telegram" type="text" placeholder="Telegram" value={editForm.telegram} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <input name="googleReviewUrl" type="text" placeholder="Google Review URL" value={editForm.googleReviewUrl} onChange={handleEditFormChange} className="border rounded px-3 py-2" />
                        <div className="flex gap-2 mt-2">
                          <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
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
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </main>
  );
} 