"use client";

import { useState } from "react";
import { AvatarUpload } from "@/components/account/AvatarUpload";

interface Props {
  userId: string;
  currentUrl: string | null;
}

export function AvatarUploadWrapper({ userId, currentUrl }: Props) {
  const [, setUrl] = useState(currentUrl);
  return <AvatarUpload userId={userId} currentUrl={currentUrl} onUploaded={setUrl} />;
}
