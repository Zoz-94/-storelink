'use client';

import Image from 'next/image';
import { StoreProfile } from '../types/store';
import { FaFacebook, FaInstagram, FaTelegram, FaGlobe, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface StoreProfileCardProps {
  profile: StoreProfile;
}

export default function StoreProfileCard({ profile }: StoreProfileCardProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            {profile.logoUrl ? (
              <Image
                src={profile.logoUrl}
                alt={`${profile.storeName} logo`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-500">{profile.storeName[0]}</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.storeName}</h2>
            <p className="text-gray-600 mt-1">{profile.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="w-5 h-5 mr-2" />
            <span>{profile.location}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <FaPhone className="w-5 h-5 mr-2" />
            <a href={`tel:${profile.phoneNumber}`} className="hover:text-blue-600">
              {profile.phoneNumber}
            </a>
          </div>
          
          <div className="flex items-center text-gray-700">
            <FaEnvelope className="w-5 h-5 mr-2" />
            <a href={`mailto:${profile.email}`} className="hover:text-blue-600">
              {profile.email}
            </a>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          {profile.socialLinks.facebook && (
            <a
              href={profile.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
          )}
          {profile.socialLinks.instagram && (
            <a
              href={profile.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
          )}
          {profile.socialLinks.telegram && (
            <a
              href={profile.socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaTelegram className="w-6 h-6" />
            </a>
          )}
          {profile.socialLinks.website && (
            <a
              href={profile.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <FaGlobe className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 