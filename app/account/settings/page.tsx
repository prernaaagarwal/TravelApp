import { redirect } from "next/navigation";

// /account/settings redirects to the canonical settings route
export default function OldSettingsPage() {
  redirect("/settings");
}
