import { useState } from 'react';
import { StoreProfileFormData } from '../types/store';

interface StoreProfileFormProps {
  initialData?: StoreProfileFormData;
  onSubmit: (data: StoreProfileFormData) => void;
  isLoading?: boolean;
}

export default function StoreProfileForm({ initialData, onSubmit, isLoading = false }: StoreProfileFormProps) {
  const [formData, setFormData] = useState<StoreProfileFormData>(() => ({
    storeName: initialData?.storeName || '',
    description: initialData?.description || '',
    logoUrl: initialData?.logoUrl || '',
    location: initialData?.location || '',
    phoneNumber: initialData?.phoneNumber || '',
    email: initialData?.email || '',
    socialLinks: {
      facebook: initialData?.socialLinks?.facebook || '',
      instagram: initialData?.socialLinks?.instagram || '',
      telegram: initialData?.socialLinks?.telegram || '',
      website: initialData?.socialLinks?.website || '',
    },
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialNetwork = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow-md">
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
          Store Name *
        </label>
        <input
          type="text"
          id="storeName"
          name="storeName"
          required
          value={formData.storeName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          id="logoUrl"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
        
        <div>
          <label htmlFor="social.facebook" className="block text-sm font-medium text-gray-700">
            Facebook URL
          </label>
          <input
            type="url"
            id="social.facebook"
            name="social.facebook"
            value={formData.socialLinks.facebook}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="social.instagram" className="block text-sm font-medium text-gray-700">
            Instagram URL
          </label>
          <input
            type="url"
            id="social.instagram"
            name="social.instagram"
            value={formData.socialLinks.instagram}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="social.telegram" className="block text-sm font-medium text-gray-700">
            Telegram URL
          </label>
          <input
            type="url"
            id="social.telegram"
            name="social.telegram"
            value={formData.socialLinks.telegram}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="social.website" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            id="social.website"
            name="social.website"
            value={formData.socialLinks.website}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
} 