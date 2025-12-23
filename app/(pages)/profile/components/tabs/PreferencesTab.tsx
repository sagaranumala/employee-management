export default function PreferencesTab() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Preferences</h3>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <Toggle label="Email Notifications" />
        <Toggle label="Push Notifications" />
      </div>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <input type="checkbox" defaultChecked />
    </div>
  );
}
