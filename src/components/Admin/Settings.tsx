import React, { useState } from "react";
import {
  Save,
  Settings as SettingsIcon,
  Shield,
  Bell,
  DollarSign,
  Globe,
} from "lucide-react";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    siteName: "Silvo Finance",
    siteDescription: "Plateforme d'investissement",
    currency: "XOF",
    maintenanceMode: false,

    // Paramètres de commission
    referralBonus: 5000,
    investmentCommission: 0.05,

    // Paramètres de notification
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Paramètres de sécurité
    twoFactorAuth: true,
    sessionTimeout: 60,
    passwordComplexity: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuler une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage("Paramètres sauvegardés avec succès!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">
          Configurez les paramètres de la plateforme
        </p>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.includes("succès")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <Section title="Général" icon={Globe}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="XOF">XOF (Franc CFA)</option>
                <option value="USD">USD (Dollar US)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Mode maintenance
              </label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  handleInputChange("maintenanceMode", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </Section>

        {/* Paramètres de commission */}
        <Section title="Commissions" icon={DollarSign}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus de parrainage (XOF)
              </label>
              <input
                type="number"
                value={settings.referralBonus}
                onChange={(e) =>
                  handleInputChange("referralBonus", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission d'investissement (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.investmentCommission * 100}
                onChange={(e) =>
                  handleInputChange(
                    "investmentCommission",
                    parseFloat(e.target.value) / 100
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Section>

        {/* Paramètres de notification */}
        <Section title="Notifications" icon={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Notifications email
              </label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleInputChange("emailNotifications", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Notifications SMS
              </label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  handleInputChange("smsNotifications", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Notifications push
              </label>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) =>
                  handleInputChange("pushNotifications", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </Section>

        {/* Paramètres de sécurité */}
        <Section title="Sécurité" icon={Shield}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Authentification à deux facteurs
              </label>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) =>
                  handleInputChange("twoFactorAuth", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délai d'expiration de session (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  handleInputChange("sessionTimeout", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Complexité des mots de passe
              </label>
              <input
                type="checkbox"
                checked={settings.passwordComplexity}
                onChange={(e) =>
                  handleInputChange("passwordComplexity", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </Section>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span>
            {isSaving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
