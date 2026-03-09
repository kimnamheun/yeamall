"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/auth";
import DaumPostcodeEmbed from "react-daum-postcode";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  zipCode: string | null;
  address: string | null;
  addressDetail: string | null;
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [zipCode, setZipCode] = useState(profile.zipCode || "");
  const [address, setAddress] = useState(profile.address || "");
  const [addressDetail, setAddressDetail] = useState(profile.addressDetail || "");
  const [showPostcode, setShowPostcode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("phone", phone);
    formData.set("zipCode", zipCode);
    formData.set("address", address);
    formData.set("addressDetail", addressDetail);

    const result = await updateProfile(formData);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("저장되었습니다.");
    }
    setSaving(false);
  };

  const handlePostcodeComplete = (data: { zonecode: string; address: string }) => {
    setZipCode(data.zonecode);
    setAddress(data.address);
    setShowPostcode(false);
  };

  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이메일 (읽기전용) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">이메일</label>
        <input type="email" value={profile.email} disabled className={`${inputClass} bg-muted text-muted-foreground cursor-not-allowed`} />
      </div>

      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">이름</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" className={inputClass} />
      </div>

      {/* 전화번호 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">전화번호</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className={inputClass} />
      </div>

      {/* 주소 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">기본 배송지</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={zipCode} readOnly placeholder="우편번호" className={`${inputClass} w-32 bg-muted cursor-not-allowed`} />
          <button
            type="button"
            onClick={() => setShowPostcode(!showPostcode)}
            className="h-11 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors shrink-0"
          >
            주소 검색
          </button>
        </div>
        {showPostcode && (
          <div className="mb-2 border border-border rounded-lg overflow-hidden">
            <DaumPostcodeEmbed onComplete={handlePostcodeComplete} style={{ height: 400 }} />
          </div>
        )}
        <input type="text" value={address} readOnly placeholder="주소" className={`${inputClass} mb-2 bg-muted cursor-not-allowed`} />
        <input
          type="text"
          value={addressDetail}
          onChange={(e) => setAddressDetail(e.target.value)}
          placeholder="상세주소를 입력하세요"
          className={inputClass}
        />
      </div>

      {message && (
        <p className={`text-sm ${message.includes("저장") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full h-12 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {saving ? "저장 중..." : "저장하기"}
      </button>
    </form>
  );
}
